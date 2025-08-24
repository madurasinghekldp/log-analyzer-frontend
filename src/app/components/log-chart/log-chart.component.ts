import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { LogStreamService } from '../../services/log-stream.service';
import { LogEntry, LogService } from '../../services/log.service';

@Component({
  selector: 'app-log-chart',
  imports: [],
  templateUrl: './log-chart.component.html',
  styleUrl: './log-chart.component.css'
})
export class LogChartComponent implements OnInit {

  private data = [
    { level: 'INFO', count: 0 },
    { level: 'WARN', count: 0 },
    { level: 'ERROR', count: 0 }
  ];

  //private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  constructor(private el: ElementRef,private streamService: LogStreamService,private logService: LogService) {}

  ngOnInit(): void {
    this.drawChart();

    // Load historical logs
    this.logService.getLogs().subscribe((logs: LogEntry[]) => {
      logs.forEach(log => this.increment(log.level));
      this.redraw();
    });

    // Subscribe to SSE for new logs
    this.streamService.stream().subscribe((log: LogEntry) => {
      this.increment(log.level);
      this.redraw();
    });
  }

  private drawChart(): void {
    const element = this.el.nativeElement.querySelector('#chart');
    // Define a color scale for log levels
    const color = d3.scaleOrdinal<string>()
      .domain(['INFO', 'WARN', 'ERROR'])
      .range(['#2196f3', '#ff9800', '#f44336']);

    // Margin convention
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG with margins
    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
    .domain(this.data.map(d => d.level))
    .range([0, width]).padding(0.2);

    const y = d3.scaleLinear()
    .domain([0, 10])
    .range([height, 0]);

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Log Level');

    // Y axis
    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    // Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Count');

    svg.selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.level)!)
      .attr('y', y(0)) // start from bottom
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', d => color(d.level));
  }

  private redraw(): void {
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    //const svg = d3.select('svg');
    const y = d3.scaleLinear().domain([0, d3.max(this.data, d => d.count) || 10]).range([height, 0]);

    //this.svg.select<SVGGElement>('.y-axis').call(d3.axisLeft(y));
    const svg = d3.select('#chart svg g');

    // Update Y axis
    svg.select<SVGGElement>('.y-axis').call(d3.axisLeft(y));

    // Update bars
    svg.selectAll<SVGRectElement, any>('rect')
      .data(this.data)
      .transition()
      .duration(300)
      .attr('y', d => y(d.count))
      .attr('height', d => height - y(d.count));
  }

  private increment(level: string): void {
    const entry = this.data.find(d => d.level.toUpperCase() === level.toUpperCase());
    if (entry) entry.count++;
  }

}
