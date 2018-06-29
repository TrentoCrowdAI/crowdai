import React from 'react'
import * as d3 from 'd3'
import {connect} from 'react-redux'

class BubbleChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: this.props.y
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.dataWrapper = this.dataWrapper.bind(this);
  }

  dataWrapper() {
    if(this.props.data.length==0) {
      var svg = d3.select("."+this.props.selector)
      var margin = {top: 0, right: 30, bottom: 80, left: 40};
      var g = svg.append("g")

      g.append("text")
        .text("No Workers on this Job yet")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else {
      this.buildGraph()
    }
  }

  buildGraph() {
    var x = this.props.x 
    var y = this.props.y 
    var z = this.props.z
    var w = this.props.w
    var data = this.props.data
    
    var workers = {
      'children': []
    }

    data.map( d => {
      workers.children.push({
        'name': d[x],
        'value': d[y]*10,
        'packageName': d[z]>60 ? 'reliable' : 'spammer'
      })
    })

    var diameter = 500
    var format = d3.format(',d')
    var color = d3.scaleOrdinal(['lightgreen','orange','#2185d0'])

    var bubble = d3.pack()
      .size([diameter*2, diameter])
      .padding(1.5)

    var svg = d3.select('.'+this.props.selector)
      .attr('width',diameter*2)
      .attr('height',diameter)

    var margin = {top: 0, right: 30, bottom: 80, left: 40};
    var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")

    var root = d3.hierarchy(workers)
      .sum(d => d.value)
      .sort( (a,b) => b.value-a.value)

    bubble(root)
    var node = g.selectAll('.node')
      .data(root.children)
      .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => {
          return 'translate('+d.x+','+d.y+')'
        })

    node.append('title')
      .text(d => d.data.packageName+':'+format(d.value))
    
    var circles = node.append("circle")
      .attr('r', d => d.r)
      .attr('id', d => d.data.name)
      .style('stroke-width', 1)
      .style('stroke', 'white')
      .style('fill', d => color(d.data.packageName))
      .on('mouseover', (d) => {
        d3.selectAll('circle')._groups[0].forEach(c => {
          if(c.id===d.data.name ) {
            c.style.stroke = '#2185d0'
            c.style['stroke-width'] = 2
            c.style.opacity='0.7'
          } else  {
            c.style.stroke = 'white'
            c.style['stroke-width'] = 1
            c.style.opacity='1' 
          }
        })
      })
      .on('click', d => {
        d3.selectAll('circle')._groups[0].forEach(c => {
          if(c.id===d.data.name ) {
            w(d, {'value': d.data.name})
          }
        })
      })

    node.append('text')
      .attr('dy','.3em')
      .style('text-anchor','middle')
      .text(d => d.data.name.substring(0, d.r/3))
  }

  componentDidMount() {
    this.dataWrapper();
  }

  componentDidUpdate() {
    d3.select('.'+this.props.selector).selectAll("g").remove();
    this.dataWrapper();
  }

  render() {

    return(
      <div>
        <br />
        <svg className={this.props.selector}></svg >
        <br />
      </div>
    )
  }
}

BubbleChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(BubbleChart);

