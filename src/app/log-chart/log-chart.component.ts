import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-log-chart',
  imports: [],
  templateUrl: './log-chart.component.html',
  styleUrl: './log-chart.component.css'
})
export class LogChartComponent implements OnInit {

  private data = [
    { level: 'INFO', count: 5 },
    { level: 'WARN', count: 10 },
    { level: 'ERROR', count: 2 }
  ];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.drawChart();
  }

  private drawChart(): void {
    const element = this.el.nativeElement.querySelector('#chart');
    const svg = d3.select(element).append('svg').attr('width', 400).attr('height', 300);

    const x = d3.scaleBand().domain(this.data.map(d => d.level)).range([0, 400]).padding(0.2);
    const y = d3.scaleLinear().domain([0, 10]).range([300, 0]);

    svg.selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.level)!)
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => 300 - y(d.count))
      .attr('fill', '#3f51b5');
  }

  // Call this when SSE receives new logs
  updateCounts(level: string): void {
    const entry = this.data.find(d => d.level === level);
    if (entry) entry.count++;
    this.redraw();
  }

  private redraw(): void {
    const svg = d3.select('svg');
    const y = d3.scaleLinear().domain([0, d3.max(this.data, d => d.count) || 10]).range([300, 0]);

    svg.selectAll('rect')
      .data(this.data)
      .transition()
      .duration(300)
      .attr('y', d => y(d.count))
      .attr('height', d => 300 - y(d.count));
  }

}
