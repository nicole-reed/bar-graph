import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import * as d3 from 'd3';

function App() {

  const [data, setData] = useState([])

  useEffect(async () => {
    try {
      const barChartData = await axios.get('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      setData(barChartData.data.data)
      console.log(barChartData.data.data)
    } catch (error) {
      console.log('there was an error fetching bar chart data:\n', error)
    }
  }, [])

  useEffect(() => {
    if (data.length) {
      const w = 1200;
      const h = 700;
      const padding = 50;

      const xScale = d3.scaleTime()
        .domain([new Date(d3.min(data, (d) => d[0])), new Date(d3.max(data, (d) => d[0]))])
        .range([padding, w - padding]);



      console.log('min date: ', d3.min(data, (d) => d[0]))
      console.log('max date: ', d3.max(data, (d) => d[0]))


      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d[1])])
        .range([h - padding, padding]);

      const svg = d3.select('#chart')
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 4 + padding)
        .attr("y", (d) => (h - d[1] / 30) - padding)
        .attr("width", 3)
        .attr("height", (d) => d[1] / 30)
        .attr('class', 'bar')
        .attr('data-date', (d) => d[0])
        .attr('data-gdp', (d) => d[1])
        .append("title")
        .attr('id', 'tooltip')
        .attr('property', 'data-date')
        .text((d) => `${d[0]}\n$${d[1]} B`);


      const xAxis = d3.axisBottom(xScale)
      const yAxis = d3.axisLeft(yScale)

      svg.append("g")
        .attr('id', 'x-axis')
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

      svg.append("g")
        .attr('id', 'y-axis')
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
    }






  }, [data])



  return (
    <div className="App">
      <h1 id='title'>United States GDP</h1>
      <div id='chart'></div>
    </div>
  );
}

export default App;
