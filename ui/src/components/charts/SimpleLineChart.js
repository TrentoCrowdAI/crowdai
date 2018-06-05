import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import {connect} from 'react-redux'

class SimpleLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: []
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.dataWrapper = this.dataWrapper.bind(this);
  }

  dataWrapper() {
    if(this.props.data.length==0) {
      var svg = d3.select("."+this.props.selector)
      var margin = {top: 10, right: 30, bottom: 30, left: 30};
      var g = svg.append("g")
      g.append("text")
        .text("No data to display yet")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    } else if(this.props.param[0]=='all') {
      var svg = d3.select("."+this.props.selector)
      var margin = {top: 10, right: 30, bottom: 30, left: 30};
      var g = svg.append("g")
      g.append("text")
        .text("Choose an Item")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    } else if(this.props.param[1]=='all') {
          var svg = d3.select("."+this.props.selector)
          var margin = {top: 10, right: 30, bottom: 30, left: 30};
          var g = svg.append("g")
          g.append("text")
            .text("Choose a Criteria")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    } else { this.buildGraph()
    }
  }

  buildGraph() {
    var svg = d3.select("."+this.props.selector);
    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var color = this.props.color

    var x = this.props.x //worker_id
    var y = this.props.y //answer
    var z = this.props.z //yes,no,not clear
    var param = this.props.param
    var datan = {}
    var datas = this.props.data
    function cc(i) {
      datan = datas.filter(d => d[y]==z[i])
      return datan.length
    }

    var labels = {
      'yes': { label: z[0], num: cc(0), xtg: cc(0)*100/datas.length },
      'no': { label: z[1], num: cc(1), xtg: cc(1)*100/datas.length },
      'not clear': { label: z[2], num: cc(2), xtg: cc(2)*100/datas.length }
    }

    //console.log(labels)

    var data = this.props.data.sort( function(a,b) {
      return (Number(a[x]) > Number(b[x])) ? 1 : ((Number(b[x]) > Number(a[x])) ? -1 : 0);
    })
    .filter(d => (d.item_id==param[0] && d.criteria_id==param[1]) )
    
    var xscale = d3.scaleLinear()
        .domain([d3.min(data, d => Number(d[x])-2),d3.max(data, d => Number(d[x])+2)])
        .range([0, width]);
    var xAxis = d3.axisBottom(xscale);

    var yscale = d3.scaleLinear()
        .domain( [d3.min(data, d => cc(z.indexOf(d[y]))*100/datas.length )-10, d3.max(data, d => cc(z.indexOf(d[y]))*100/datas.length )+10] )
        .range([height, 0]);
    var yAxis = d3.axisLeft(yscale);

    g.append("g")
       .attr("class","x axis")
       .attr("transform","translate(0,"+height+")")
       .call(xAxis)
       .append("text")
          .attr("fill","black")
          .attr("transform","translate("+(width-10)+",0)")
          .attr("dy","-1em")
          .text(this.props.x);

    g.append("g")
       .attr("class","y axis")
       .call(yAxis)
       .append("text")
          .attr("fill","black")
          .attr("transform","rotate(-90)")
          .attr("text-anchor","end")
          .attr("dy","2em")
          .text("%");

    //deploy data to be dispalyed on a line
    var line = d3.line()
        .x( (d) => { return xscale( Number(d[x]) ) } )
        .y( (d) => { return yscale( labels[d[y]].xtg ) } )
        .curve(d3.curveMonotoneX);

    var goldline = d3.line()
      .x( (d) => {return xscale(d[x]+","+d[z])} )
      .y( (d) => {return yscale(d[y]/1000)} )

    var xtggold = Math.max( labels[z[0]].xtg, labels[z[1]].xtg, labels[z[2]].xtg )
    var labelgold
    z.map(d => labels[d].xtg==xtggold ? labelgold=labels[d].label : null )
    
    //console.log(labelgold, xtggold)

    g.append("text")
      .attr("fill", "red")
      .attr("transform", "translate("+width/2+","+yscale(labels[labelgold].xtg)+")")
      .attr("text-anchor","middle")
      .attr("dy","-0.5em")
      .text(labelgold)

    g.append("text")
      .attr("fill", "lightgreen")
      .attr("transform", "translate("+width/2+","+yscale(labels['not clear'].xtg)+")")
      .attr("text-anchor","middle")
      .attr("dy","-0.5em")
      .text('not clear')

    g.append("path")
      .datum([
        {
          item_id: 1,
          criteria_id: 1,
          worker_id: "0",
          answer: labelgold
        },
        {
          item_id: 1,
          criteria_id: 1,
          worker_id: '500',
          answer: labelgold
        }])
      .attr("class","gold")
      .attr("transform","translate(0,0)")
      .attr("d", line)
      .style("stroke", "red")
      .style("fill","none")
      .style("stroke-width",1)
      
      g.append("path")
      .datum([
        {
          item_id: 1,
          criteria_id: 1,
          worker_id: "0",
          answer: 'not clear'
        },
        {
          item_id: 1,
          criteria_id: 1,
          worker_id: '500',
          answer: 'not clear'
        }])
      .attr("class","gold")
      .attr("transform","translate(0,0)")
      .attr("d", line)
      .style("stroke", "lightgreen")
      .style("fill","none")
      .style("stroke-width",1)
    

    g.append("path")
      .datum(data)
      .attr("class","original")
      .attr("d", line)
      .style("stroke", 'orange')
      .style("fill","none")
      .style("stroke-width",2)

    g.selectAll(".dot")
      .data(data).enter()
        .append("circle")
        .style("fill", 'steelblue')
        .attr("class","dot")
        .attr("cx", d => xscale(d[x]) )
        .attr("cy", d => yscale(labels[d[y]].xtg) )
        .attr("r",4)
        .on("click", (d) => {
          this.setState({
            clicked: []
          })
          data.map(step => {
            if(step[x] === d[x] && step[y] === d[y]) {
              var nuovo = this.state.clicked.concat([
                this.props.x+" : "+d[x]+",   "+this.props.y+" : "+d[y]
                ])
              this.setState({
                clicked: nuovo
              })
            }
          })
        })
        
        //drag modifying data
        /*.call(d3.drag()
          .on("drag", function(d) {
            d[x] = Math.round(xscale.invert(d3.event.x))
            d[y] = Math.round(yscale.invert(d3.event.y))
            //console.log(d)

            d3.select(this)
            .attr("cx",xscale(d[x]))
            .attr("cy",yscale(d[y]))

            g.select(".line").remove()

            g.append("path")
              .datum(data)
              .attr("class","line")
              .attr("d", line)
              .style("stroke", "dark"+color)
              .style("fill","none")
              .style("stroke-width",2)
          })
          .on("end", function() {

            g.selectAll(".line").remove()

            data.sort( function(a,b) {
              return (a[x] > b[x]) ? 1 : ((b[x] > a[x]) ? -1 : 0);
            })

            g.append("path")
              .datum(data)
              .attr("class","line")
              .attr("d", line)
              .style("stroke", "dark"+color)
              .style("fill","none")
              .style("stroke-width",2)
          })
        )*/
        .on("mouseover", function() {
          d3.select(this)
          .style("opacity", "0.5")
        })
        .on("mouseout", function() {
          d3.select(this)
          .style("opacity","1")
        })

  }

  componentDidMount() {
    this.dataWrapper();
  }

  componentDidUpdate() {
    d3.select("."+this.props.selector).selectAll("g").remove();
    this.dataWrapper();
  }

  render() {
    //console.log(this.props)
    return(
      <div>
        <svg className={this.props.selector} width="1000" height="600"> </svg>
        <br />
        <strong>Clicked data:</strong> {this.state.clicked}
      </div>
    )
  }
}

SimpleLineChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(SimpleLineChart);
