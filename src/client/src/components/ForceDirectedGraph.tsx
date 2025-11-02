import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

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
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [status, setStatus] = useState<string>('Connecting...');
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);

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
          // Initial graph data
          setGraphData({
            nodes: data.nodes || [],
            links: data.links || []
          });
        } else if (data.type === 'add-node') {
          // Add a new node with an edge
          setGraphData(prev => ({
            nodes: [...prev.nodes, data.node],
            links: [...prev.links, data.link]
          }));
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
  }, []);

  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous elements
    svg.selectAll('*').remove();

    // Create a container group for zooming/panning
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create the simulation
    const simulation = d3.forceSimulation<Node>(graphData.nodes)
      .force('link', d3.forceLink<Node, Link>(graphData.links)
        .id((d) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    simulationRef.current = simulation;

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graphData.nodes)
      .join('circle')
      .attr('r', 10)
      .attr('fill', '#69b3a2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add drag behavior
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

    // Type assertion needed due to D3 type complexity
    type DragSelection = d3.Selection<SVGCircleElement | d3.BaseType, Node, SVGGElement, unknown>;
    node.call(dragBehavior as (selection: DragSelection) => void);

    // Add labels
    const labels = g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(graphData.nodes)
      .join('text')
      .text((d) => d.id)
      .attr('font-size', 12)
      .attr('dx', 15)
      .attr('dy', 4);

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as Node).x || 0)
        .attr('y1', (d) => (d.source as Node).y || 0)
        .attr('x2', (d) => (d.target as Node).x || 0)
        .attr('y2', (d) => (d.target as Node).y || 0);

      node
        .attr('cx', (d) => d.x || 0)
        .attr('cy', (d) => d.y || 0);

      labels
        .attr('x', (d) => d.x || 0)
        .attr('y', (d) => d.y || 0);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData]);

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        <h2 style={{ margin: 0 }}>Derivative - Generative Art Graph</h2>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
          Status: <strong>{status}</strong> | Nodes: <strong>{graphData.nodes.length}</strong> | 
          Edges: <strong>{graphData.links.length}</strong>
        </p>
      </div>
      <svg
        ref={svgRef}
        style={{ flex: 1, background: '#fff' }}
      />
    </div>
  );
}
