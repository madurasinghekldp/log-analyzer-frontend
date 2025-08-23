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

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;

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
    this.svg = d3.select(element).append('svg').attr('width', 400).attr('height', 300);

    const x = d3.scaleBand().domain(this.data.map(d => d.level)).range([0, 400]).padding(0.2);
    this.svg.append('g')
          .attr('transform', 'translate(0,300)')
          .call(d3.axisBottom(x));

    this.svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(d3.scaleLinear().domain([0, 10]).range([300, 0])));

    this.svg.selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.level)!)
      .attr('y', 300) // start from bottom
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', '#3f51b5');
  }

  private redraw(): void {
    //const svg = d3.select('svg');
    const y = d3.scaleLinear().domain([0, d3.max(this.data, d => d.count) || 10]).range([300, 0]);

    this.svg.select<SVGGElement>('.y-axis').call(d3.axisLeft(y));

    this.svg.selectAll('rect')
      .data(this.data)
      .transition()
      .duration(300)
      .attr('y', d => y(d.count))
      .attr('height', d => 300 - y(d.count));
  }

  private increment(level: string): void {
    const entry = this.data.find(d => d.level.toUpperCase() === level.toUpperCase());
    if (entry) entry.count++;
  }

}
