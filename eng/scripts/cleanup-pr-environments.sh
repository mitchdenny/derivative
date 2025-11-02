#!/bin/bash
set -e

# Script to cleanup stale PR environment resource groups in Azure
# Usage: cleanup-pr-environments.sh <azure-subscription-id> <github-repo> <github-token>

AZURE_SUBSCRIPTION_ID="${1}"
GITHUB_REPO="${2:-mitchdenny/derivative}"
GITHUB_TOKEN="${3:-${GITHUB_TOKEN}}"
INACTIVITY_THRESHOLD_HOURS="${4:-1}"

if [ -z "$AZURE_SUBSCRIPTION_ID" ]; then
    echo "Error: Azure subscription ID is required as first argument"
    echo "Usage: $0 <azure-subscription-id> [github-repo] [github-token] [inactivity-threshold-hours]"
    exit 1
fi

if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GITHUB_TOKEN environment variable must be set or provided as third argument"
    exit 1
fi

echo "Starting PR environment cleanup..."
echo "Subscription: $AZURE_SUBSCRIPTION_ID"
echo "Repository: $GITHUB_REPO"
echo "Inactivity threshold: $INACTIVITY_THRESHOLD_HOURS hour(s)"
echo ""

# Set the Azure subscription
az account set --subscription "$AZURE_SUBSCRIPTION_ID"

# Calculate the threshold timestamp (current time - inactivity threshold)
THRESHOLD_TIMESTAMP=$(date -u -d "$INACTIVITY_THRESHOLD_HOURS hours ago" +%s)

# Get all resource groups matching the pattern derivative-pr-*
echo "Fetching resource groups matching pattern 'derivative-pr-*'..."
RESOURCE_GROUPS=$(az group list --query "[?starts_with(name, 'derivative-pr-')].name" -o tsv)

if [ -z "$RESOURCE_GROUPS" ]; then
    echo "No PR resource groups found."
    exit 0
fi

echo "Found $(echo "$RESOURCE_GROUPS" | wc -l) resource group(s) to check"
echo ""

# Process each resource group
for RG_NAME in $RESOURCE_GROUPS; do
    echo "Checking resource group: $RG_NAME"
    
    # Extract PR number from resource group name (derivative-pr-123 -> 123)
    if [[ $RG_NAME =~ derivative-pr-([0-9]+) ]]; then
        PR_NUMBER="${BASH_REMATCH[1]}"
        echo "  PR Number: $PR_NUMBER"
        
        # Get PR details from GitHub API
        PR_DATA=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/repos/$GITHUB_REPO/pulls/$PR_NUMBER")
        
        # Check if PR exists
        PR_STATE=$(echo "$PR_DATA" | jq -r '.state // "not_found"')
        
        if [ "$PR_STATE" == "not_found" ] || [ "$PR_STATE" == "null" ]; then
            echo "  PR #$PR_NUMBER not found or API error. Skipping deletion for safety."
            echo ""
            continue
        fi
        
        echo "  PR State: $PR_STATE"
        
        # Get the last updated timestamp
        UPDATED_AT=$(echo "$PR_DATA" | jq -r '.updated_at')
        
        if [ -z "$UPDATED_AT" ] || [ "$UPDATED_AT" == "null" ]; then
            echo "  Could not determine last update time. Skipping."
            echo ""
            continue
        fi
        
        # Convert GitHub timestamp to Unix timestamp
        UPDATED_TIMESTAMP=$(date -u -d "$UPDATED_AT" +%s)
        
        # Calculate time difference in seconds
        TIME_DIFF=$(($(date +%s) - UPDATED_TIMESTAMP))
        TIME_DIFF_HOURS=$((TIME_DIFF / 3600))
        
        echo "  Last updated: $UPDATED_AT (${TIME_DIFF_HOURS} hours ago)"
        
        # Check if PR has been inactive for more than the threshold
        if [ "$UPDATED_TIMESTAMP" -lt "$THRESHOLD_TIMESTAMP" ]; then
            echo "  ✓ PR has been inactive for more than $INACTIVITY_THRESHOLD_HOURS hour(s)"
            echo "  Deleting resource group: $RG_NAME"
            
            # Delete the resource group
            az group delete --name "$RG_NAME" --yes --no-wait
            
            echo "  ✓ Deletion initiated (running asynchronously)"
        else
            echo "  ✗ PR is still active (updated within last $INACTIVITY_THRESHOLD_HOURS hour(s)). Keeping resource group."
        fi
    else
        echo "  Warning: Could not extract PR number from resource group name: $RG_NAME"
    fi
    
    echo ""
done

echo "Cleanup process completed."
