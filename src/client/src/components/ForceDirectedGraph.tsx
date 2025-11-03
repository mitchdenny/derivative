import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import ThemeSelector from './ThemeSelector';

interface Node extends d3.SimulationNodeDatum {
  id: string;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

export default function ForceDirectedGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [status, setStatus] = useState<string>('Connecting...');
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  
  // Store graph data as refs to avoid triggering rerenders
  const graphDataRef = useRef<GraphData>({ nodes: [], links: [] });
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
  const svgGroupRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const linkSelectionRef = useRef<d3.Selection<SVGLineElement, Link, SVGGElement, unknown> | null>(null);
  const nodeSelectionRef = useRef<d3.Selection<SVGCircleElement, Node, SVGGElement, unknown> | null>(null);
  const labelSelectionRef = useRef<d3.Selection<SVGTextElement, Node, SVGGElement, unknown> | null>(null);

  // Get theme-aware colors
  const getColors = useCallback(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    return {
      nodeFill: style.getPropertyValue('--node-fill').trim() || '#69b3a2',
      nodeStroke: style.getPropertyValue('--node-stroke').trim() || '#ffffff',
      edgeStroke: style.getPropertyValue('--edge-stroke').trim() || '#999999',
      bgPrimary: style.getPropertyValue('--bg-primary').trim() || '#ffffff',
    };
  }, []);

  // Function to update the graph with new data (incremental update)
  const updateGraph = useCallback((newNode?: Node, newLink?: Link) => {
    if (!svgRef.current || !simulationRef.current || !svgGroupRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = svgGroupRef.current;
    const simulation = simulationRef.current;
    const graphData = graphDataRef.current;
    const colors = getColors();
    
    const MAX_NODES = 30;

    // Add new node and link if provided
    if (newNode && newLink) {
      graphData.nodes.push(newNode);
      graphData.links.push(newLink);
      
      // Cull oldest nodes if we exceed MAX_NODES
      if (graphData.nodes.length > MAX_NODES) {
        const nodesToRemove = graphData.nodes.length - MAX_NODES;
        const removedNodes = graphData.nodes.splice(0, nodesToRemove);
        const removedNodeIds = new Set(removedNodes.map(n => n.id));
        
        // Remove links connected to removed nodes
        graphData.links = graphData.links.filter(link => {
          const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
          const targetId = typeof link.target === 'string' ? link.target : link.target.id;
          return !removedNodeIds.has(sourceId) && !removedNodeIds.has(targetId);
        });
      }
    }

    // Update the simulation with new nodes/links
    simulation.nodes(graphData.nodes);
    const linkForce = simulation.force('link') as d3.ForceLink<Node, Link>;
    if (linkForce) {
      linkForce.links(graphData.links);
    }

    // Update links using D3 data join
    const link = g.select<SVGGElement>('.links')
      .selectAll<SVGLineElement, Link>('line')
      .data(graphData.links, (d: Link) => `${(d.source as Node).id}-${(d.target as Node).id}`);

    link.enter()
      .append('line')
      .attr('stroke', colors.edgeStroke)
      .attr('stroke-opacity', 1.0)
      .attr('stroke-width', 3)
      // Set initial coordinates to prevent rendering issues on all browsers
      .attr('x1', (d) => (d.source as Node).x || 0)
      .attr('y1', (d) => (d.source as Node).y || 0)
      .attr('x2', (d) => (d.target as Node).x || 0)
      .attr('y2', (d) => (d.target as Node).y || 0)
      .merge(link);

    link.exit().remove();
    linkSelectionRef.current = g.select<SVGGElement>('.links').selectAll<SVGLineElement, Link>('line');

    // Update nodes using D3 data join
    const node = g.select<SVGGElement>('.nodes')
      .selectAll<SVGCircleElement, Node>('circle')
      .data(graphData.nodes, (d: Node) => d.id);

    const nodeEnter = node.enter()
      .append('circle')
      .attr('r', 20)
      .attr('fill', colors.nodeFill)
      .attr('stroke', colors.nodeStroke)
      .attr('stroke-width', 2);

    // Add drag behavior to new nodes
    const dragBehavior = d3.drag<SVGCircleElement, Node>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodeEnter.call(dragBehavior as any);
    nodeEnter.merge(node);

    node.exit().remove();
    nodeSelectionRef.current = g.select<SVGGElement>('.nodes').selectAll<SVGCircleElement, Node>('circle');

    // Update labels using D3 data join
    const labels = g.select<SVGGElement>('.labels')
      .selectAll<SVGTextElement, Node>('text')
      .data(graphData.nodes, (d: Node) => d.id);

    labels.enter()
      .append('text')
      .text((d) => d.id)
      .attr('font-size', 12)
      .attr('dx', 25)
      .attr('dy', 4)
      .merge(labels);

    labels.exit().remove();
    labelSelectionRef.current = g.select<SVGGElement>('.labels').selectAll<SVGTextElement, Node>('text');

    // Restart simulation with new data
    simulation.alpha(0.3).restart();

    // If a new node was added, smoothly transition view to center on it
    if (newNode && graphData.nodes.length > 1) {
      // Wait a bit for the simulation to position the node
      setTimeout(() => {
        // Calculate bounds of all nodes to determine zoom level
        const bounds = {
          minX: Infinity,
          maxX: -Infinity,
          minY: Infinity,
          maxY: -Infinity
        };

        // Consider at least 4 nodes for bounds calculation
        const nodesToConsider = Math.min(4, graphData.nodes.length);
        const recentNodes = graphData.nodes.slice(-nodesToConsider);

        recentNodes.forEach(n => {
          if (n.x !== undefined && n.y !== undefined) {
            bounds.minX = Math.min(bounds.minX, n.x);
            bounds.maxX = Math.max(bounds.maxX, n.x);
            bounds.minY = Math.min(bounds.minY, n.y);
            bounds.maxY = Math.max(bounds.maxY, n.y);
          }
        });

        // Add padding
        const padding = 100;
        bounds.minX -= padding;
        bounds.maxX += padding;
        bounds.minY -= padding;
        bounds.maxY += padding;

        const width = svgRef.current!.clientWidth;
        const height = svgRef.current!.clientHeight;

        // Calculate center point
        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;

        // Calculate appropriate scale to fit the nodes
        const boundsWidth = bounds.maxX - bounds.minX;
        const boundsHeight = bounds.maxY - bounds.minY;
        const scale = Math.min(
          width / boundsWidth,
          height / boundsHeight,
          1.5 // Max zoom in
        );

        // Calculate transform to center the view
        const transform = d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scale)
          .translate(-centerX, -centerY);

        // Smoothly transition to the new view
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (svg.transition() as any)
          .duration(750)
          .call(zoomBehaviorRef.current!.transform, transform);
      }, 300);
    }

    // Update counts
    setNodeCount(graphData.nodes.length);
    setEdgeCount(graphData.links.length);
  }, [getColors]);

  // Initialize graph once on mount
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create a container group for zooming/panning
    const g = svg.append('g');
    svgGroupRef.current = g;

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Create the simulation
    const simulation = d3.forceSimulation<Node>([])
      .force('link', d3.forceLink<Node, Link>([])
        .id((d) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    simulationRef.current = simulation;

    // Create groups for links, nodes, and labels
    g.append('g').attr('class', 'links');
    g.append('g').attr('class', 'nodes');
    g.append('g').attr('class', 'labels');

    // Update positions on each tick
    simulation.on('tick', () => {
      const links = linkSelectionRef.current;
      const nodes = nodeSelectionRef.current;
      const labels = labelSelectionRef.current;

      if (links) {
        links
          .attr('x1', (d) => (d.source as Node).x || 0)
          .attr('y1', (d) => (d.source as Node).y || 0)
          .attr('x2', (d) => (d.target as Node).x || 0)
          .attr('y2', (d) => (d.target as Node).y || 0);
      }

      if (nodes) {
        nodes
          .attr('cx', (d) => d.x || 0)
          .attr('cy', (d) => d.y || 0);
      }

      if (labels) {
        labels
          .attr('x', (d) => d.x || 0)
          .attr('y', (d) => d.y || 0);
      }
    });

    return () => {
      simulation.stop();
      svg.selectAll('*').remove();
    };
  }, []);

  // WebSocket connection
  useEffect(() => {
    // In development, use the proxy path. In production, use the backend URL from env
    const wsUrl = import.meta.env.DEV 
      ? `ws://${window.location.host}/ws/graph`
      : `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/graph`;

    console.log('Connecting to WebSocket:', wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setStatus('Connected');
    };

    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'initial') {
          // Initial graph data - clear and set
          graphDataRef.current = {
            nodes: data.nodes || [],
            links: data.links || []
          };
          updateGraph();
        } else if (data.type === 'add-node') {
          // Add a new node with an edge incrementally
          updateGraph(data.node, data.link);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('Error connecting');
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setStatus('Disconnected');
    };

    return () => {
      ws.close();
    };
  }, [updateGraph]);

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ 
        padding: '10px', 
        background: 'var(--header-bg)', 
        borderBottom: `1px solid var(--header-border)`,
        color: 'var(--text-primary)',
      }}>
        <h2 style={{ margin: 0 }}>Derivative - Generative Art Graph</h2>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Status: <strong>{status}</strong> | Nodes: <strong>{nodeCount}</strong> | 
          Edges: <strong>{edgeCount}</strong>
        </p>
      </div>
      <svg
        ref={svgRef}
        style={{ flex: 1, background: 'var(--bg-primary)', width: '100%', height: '100%' }}
      />
      <ThemeSelector />
    </div>
  );
}
