import React from 'react'
import * as d3 from 'd3'
import {connect} from 'react-redux'


class TreeChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: this.props.y
    }
    this.buildGraph = this.buildGraph.bind(this);
    this.dataWrapper = this.dataWrapper.bind(this);
  }

  dataWrapper() {
    /*if(this.props.param==='all') {
      var svg = d3.select('.'+this.props.selector)
      var margin = {top: 10, right: 30, bottom: 30, left: 30};
      var g = svg.append('g')

      g.append('text')
        .text('No data in this Job yet')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    } else {*/
      this.buildGraph()
    //}
  }

  buildGraph() {
    var svg = d3.select('.'+this.props.selector);

    var margin = {top: 10, right: 30, bottom: 10, left: 110};
    var width = +svg.attr('width') - margin.left - margin.right;
    var height = +svg.attr('height') - margin.top - margin.bottom;
    var g = svg.append('g')
      .attr('class','innerspace')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var w = this.props.w
    //var param = this.props.param //chosenitem

    var data = this.props.data
    
    var criteria = Array.from(new Set(data.map(d => d[y]) ))

    //MAKE ALL THIS DYNAMIC FOR EFFICIENCY

    //compute subset of filtered data
    var y1 = Array.from(new Set(data.filter(d => d[y]===criteria[0] && d[w]===z[0]).map(d => d[x])))
    var n1 = Array.from(new Set(data.filter(d => d[y]===criteria[0] && d[w]===z[1]).map(d => d[x])))
    var yy = []
    var yn = []
    var ny = []
    var nn = []
    var yyy = []
    var yyn = []
    var yny = []
    var ynn = []
    var nyy = []
    var nyn = []
    var nny = []
    var nnn = []
    
  if (criteria[1]!=undefined) {
    for(var a in y1) {
      yy = yy.concat(Array.from(new Set(
          data
          .filter(d => d[x]===y1[a] && d[y]===criteria[1] && d[w]===z[0])
          .map(d => d[x])
        )))
      yn = yn.concat(Array.from(new Set(
          data
          .filter(d => d[x]===y1[a] && d[y]===criteria[1] && d[w]===z[1])
          .map(d => d[x])
        )))
    }
    for(var a in n1) {
      ny = ny.concat(Array.from(new Set(
          data
          .filter(d => d[x]===n1[a] && d[y]===criteria[1] && d[w]===z[0])
          .map(d => d[x])
        )))
      nn = nn.concat(Array.from(new Set(
          data
          .filter(d => d[x]===n1[a] && d[y]===criteria[1] && d[w]===z[1])
          .map(d => d[x])
        )))
    }
  }
  if (criteria[2]!=undefined) {
    for(var a in yy) {
      yyy = yyy.concat(Array.from(new Set(
          data
          .filter(d => d[x]===yy[a] && d[y]===criteria[2] && d[w]===z[0])
          .map(d => d[x])
        )))
      yyn = yyn.concat(Array.from(new Set(
          data
          .filter(d => d[x]===yy[a] && d[y]===criteria[2] && d[w]===z[1])
          .map(d => d[x])
        )))
    }
    for(var a in yn) {
      yny = yny.concat(Array.from(new Set(
          data
          .filter(d => d[x]===yn[a] && d[y]===criteria[2] && d[w]===z[0])
          .map(d => d[x])
        )))
      ynn = ynn.concat(Array.from(new Set(
          data
          .filter(d => d[x]===yn[a] && d[y]===criteria[2] && d[w]===z[1])
          .map(d => d[x])
        )))
    }
    for(var a in ny) {
      nyy = nyy.concat(Array.from(new Set(
          data
          .filter(d => d[x]===ny[a] && d[y]===criteria[2] && d[w]===z[0])
          .map(d => d[x])
        )))
      nyn = nyn.concat(Array.from(new Set(
          data
          .filter(d => d[x]===ny[a] && d[y]===criteria[2] && d[w]===z[1])
          .map(d => d[x])
        )))
    }
    for(var a in nn) {
      nny = nny.concat(Array.from(new Set(
          data
          .filter(d => d[x]===nn[a] && d[y]===criteria[2] && d[w]===z[0])
          .map(d => d[x])
        )))
      nnn = nnn.concat(Array.from(new Set(
          data
          .filter(d => d[x]===nn[a] && d[y]===criteria[2] && d[w]===z[1])
          .map(d => d[x])
        )))
    }
  }
    
    //build tree structured data to be displayed
    var treeData = {
      'name': 'Item Id',
      'answer': 'All',
      'num': y1.length+n1.length,
      'items': Array.from(new Set(data.map(d => d[x]))),
      'children': criteria[0]!=undefined ?
       [{
          'name': 'Criteria '+criteria[0],
          'answer': z[0],
          'num': y1.length,
          'items': y1,
          'children': criteria[1]!=undefined ?
            [{
              'name': 'Criteria '+criteria[1],
              'answer': z[0],
              'num': yy.length,
              'items': yy,
              'children': criteria[2]!=undefined ?
                [{'name': 'Criteria '+criteria[2],
                  'num': yyy.length,
                  'items': yyy,
                  'answer': z[0]},
                  {'name': 'Criteria '+criteria[2],
                  'num': yyn.length,
                  'items': yyn,
                  'answer': z[1]}] : [{}]
            },
            {
              'name': 'Criteria '+criteria[1],
              'answer': z[1],
              'num': yn.length,
              'items': yn,
              'children': criteria[2]!=undefined ?
                [{'name': 'Criteria '+criteria[2],
                  'num': yny.length,
                  'items': yny,
                  'answer': z[0]},
                  {'name': 'Criteria '+criteria[2],
                  'num': ynn.length,
                  'items': ynn,
                  'answer': z[1]}] : [{}]
            }] : [{}]
        },
        {
          'name': 'Criteria '+criteria[0],
          'num': n1.length,
          'items': n1,
          'answer': z[1],
          'children': criteria[1]!=undefined ?
            [{
              'name': 'Criteria '+criteria[1],
              'answer': z[0],
              'num': ny.length,
              'items': ny,
              'children': criteria[2]!=undefined ?
                [{'name': 'Criteria '+criteria[2],
                  'num': nyy.length,
                  'items': nyy,
                  'answer': z[0]},
                  {'name': 'Criteria '+criteria[2],
                  'num': nyn.length,
                  'items': nyn,
                  'answer': z[1]}] : [{}]
            },
            {
              'name': 'Criteria '+criteria[1],
              'answer': z[1],
              'num': nn.length,
              'items': nn,
              'children': criteria[2]!=undefined ? 
                [{'name': 'Criteria '+criteria[2],
                  'num': nny.length,
                  'items': nny,
                  'answer': z[0]},
                  {'name': 'Criteria '+criteria[2],
                  'num': nnn.length,
                  'items': nnn,
                  'answer': z[1]}] : [{}]
            }] : [{}]
        }] : [{}]
    }

    var i = 0
    var duration = 750
    var root

    var treemap = d3.tree().size([height,width])
    root = d3.hierarchy(treeData, d => d.children)
    root.x0 = height/2
    root.y0 = 0
    
    root.children.forEach(collapse)
    update(root)

    function collapse(d) {
      if(d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
      }
    }

    function update(source) {
      var treeData = treemap(root)
      var nodes = treeData.descendants()
      var links = treeData.descendants().slice(1)

      var tooltip = d3.select('body')
        .append('div')
        .style('width', '200px')
        .style('height','50px')
        .style('background','#A7DEF2')
        .style('opacity','0.90')
        .style('position','absolute')
        .style('visibility','hidden')
        .style('padding','5px')
        .style('box-shadow','0px 0px 6px #7861A5')

    tooltip.append('div')

      nodes.forEach(d => d.y = d.depth*180)

      var node = g.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++i) } )

      var nodeEnter = node.enter().append('g')
        .attr('class','node')
        .attr('transform', d => 'translate('+source.y0+','+source.x0+')')
        .on('click',click)
        .on('mousemove', d => {
          tooltip.style('visibility', 'visible')
            .style('width', d.data.items.length>7 ? ((20*d.data.items.length)+'px') : '200px')
            .style('top',(d3.event.pageY-80)+'px')
            .style('left',(d3.event.pageX-220)+'px')
          tooltip.select('div')
            .html('Classified Items: <br/><b>'+d.data.items+'</b>')
        })
        .on('mouseout', d => {
          tooltip.style('visibility', 'hidden')
        })

      nodeEnter.append('circle')
        .attr('class','node')
        .attr('r',1e-6)
        .style('fill', d =>  d._children ? 'lightsteelblue' : '#fff')
        .style('opacity','0.8')
      nodeEnter.append('text')
        .attr('dy','.50em')
        .attr('x', d => (d.children || d._children) ? 0 : 13)
        .attr('y', d => (d.children || d._children) ? -20 : 0)
        .attr('text-anchor', d => (d.children || d._children) ? 'middle' : 'start')
        .text(d => d.data.name+' =\''+d.data.answer+'\', '+d.data.num+' items')
          .style('font-weight', 'bold')
      
      var nodeUpdate = nodeEnter.merge(node)
      nodeUpdate.transition()
        .duration(duration)
        .attr('transform', d => 'translate('+d.y+','+d.x+')')
      nodeUpdate.select('circle.node')
        .attr('r',10)
        .style('fill', d => d._children ? 'lightsteelblue' : '#fff')
        .style('opacity','0.8')
        .attr('cursor','pointer')

      var nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', d => 'translate('+source.y+','+source.x+')')
        .remove()
      nodeExit.select('circle')
        .attr('r', 1e-6)
      nodeExit.select('text')
        .style('fill-opacity', 1e-6)

      var link = svg.selectAll('path.link')
          .data(links, d => d.id )
    
      var linkEnter = link.enter().insert('path', 'g')
          .attr('class', 'link')
          .attr('d', d => {
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
          })
          .attr('transform', d => 'translate('+margin.left+','+margin.top+')')
          .style('stroke', d => d.data.answer===z[1] ? 'orange' : 'lightgreen')
      linkEnter.append('text')
        .attr('dy','.35em')
        .attr('x', 20)
        .text('answer x')

      var linkUpdate = linkEnter.merge(link)
      linkUpdate.transition()
          .duration(duration)
          .attr('d', d => diagonal(d, d.parent) )
    
      var linkExit = link.exit().transition()
          .duration(duration)
          .attr('d', d => {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
          })
          .remove()
      
      function diagonal(s, d) {
        var path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`
        return path
      }

      nodes.forEach( d => {
          d.x0 = d.x;
          d.y0 = d.y;
        }
      )

      function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
        update(d);
      }

    }
  }

  componentDidMount() {
    this.dataWrapper();
  }

  componentDidUpdate() {
    d3.select('.'+this.props.selector).selectAll('g').remove();
    this.dataWrapper();
  }

  render() {
    var x = this.props.x
    var y = this.props.y
    var z = this.props.z
    var w = this.props.w

    return(
      <div>
        <ul className={'legend'}>
          <li><span style={{'backgroundColor':'lightgreen'}}></span>Answer is '{z[0]}'</li>
          <li><span style={{'backgroundColor':'orange'}}></span>Answer is '{z[1]}'</li>
        </ul>
        <br />
        <br />
        <svg className={this.props.selector} width='900' height='500'> </svg>
        <br />
      </div>
    )
  }
}

TreeChart.propTypes = {

}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(TreeChart);

