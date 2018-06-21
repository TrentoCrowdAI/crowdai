import React from 'react';
import c3 from 'c3';
import 'c3/c3.css';
import PropTypes from 'prop-types';
import {Header, Segment, List, Label} from 'semantic-ui-react';
import {nest} from 'd3-collection';
import {ticks, max, min} from 'd3-array';
import {select} from 'd3-selection';
import ReactDOMServer from 'react-dom/server';

class PriceLossChart extends React.Component {
  render() {
    return (
      <div>
        <Header as="h3" textAlign="center">
          Loss vs Price trade-off
        </Header>
        <div style={this.props.style || {}} ref={node => (this.node = node)} />
        <div>
          <span>
            <b>Price</b> is the average number of crowd votes per paper
          </span>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  componentDidMount() {
    if (!this.chart) {
      this.chart = this.generate();
    } else {
      this.chart.unload();
      this.chart.load(this.group(this.props.data));
    }
    let firstLegend = select('.c3-legend-item');
    let legendCon = select(firstLegend.node().parentNode);
    let legendY = parseInt(legendCon.select('text').attr('y'), 10);
    legendCon
      .append('text')
      .text('#Votes per task')
      .attr('y', legendY - 20)
      .attr('x', -30);
  }

  generate() {
    let grouped = this.group(this.props.data);

    return c3.generate({
      bindto: this.node,
      data: grouped,
      axis: {
        x: {
          label: {
            text: 'Price',
            position: 'outer-center'
          },
          tick: {
            format: x => x.toFixed(2),
            values: ticks(grouped.min - 5, grouped.max + 5, 5)
          }
        },
        y: {
          label: {
            text: 'Expected loss',
            position: 'outer-center'
          },
          min: 0
        }
      },
      legend: {
        position: 'right'
      },
      zoom: {
        enabled: true
      },
      tooltip: {
        contents: (d, defaultTitleFormat, defaultValueFormat, color) => {
          const point = d[0];
          const data = grouped.src[point.name][point.index];
          return ReactDOMServer.renderToString(
            <Segment>
              <Label corner="right" style={{borderColor: color(point)}} />
              <List divided relaxed>
                <List.Item>
                  <List.Icon name="balance scale" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header>Loss</List.Header>
                    <List.Description>{data.loss_mean}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="money bill alternate outline" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header>Price</List.Header>
                    <List.Description>{data.price_mean}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="users" size="large" verticalAlign="middle" />
                  <List.Content>
                    <List.Header>#Votes per task</List.Header>
                    <List.Description>{data.votes_per_item}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon
                    style={{paddingLeft: '0px', width: '1.6em'}}
                    name="list alternate outline"
                    size="large"
                    verticalAlign="middle"
                  />
                  <List.Content>
                    <List.Header>#Initial tests</List.Header>
                    <List.Description>{data.worker_tests}</List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Segment>
          );
        }
      }
    });
  }

  group(data) {
    let maxPrice = max(data, d => d.price_mean);
    let minPrice = min(data, d => d.price_mean);
    let grouped = nest()
      .key(d => d.votes_per_item)
      .entries(data);

    // we create the data configuration as seen in http://c3js.org/samples/simple_xy_multiple.html
    let output = {
      xs: {}, // axis
      src: {}, // source objects
      columns: [], // values x=price_mean y=loss_mean
      max: maxPrice,
      min: minPrice
    };
    let x = 0;

    for (let entry of grouped) {
      const xid = `X${x}`;
      output.xs[entry.key] = xid;
      output.columns.push([xid, ...Object.values(entry.values.map(e => e.price_mean))]);
      output.columns.push([entry.key, ...Object.values(entry.values.map(e => e.loss_mean))]);
      output.src[entry.key] = entry.values;
      ++x;
    }
    return output;
  }
}

PriceLossChart.propTypes = {
  style: PropTypes.object,
  data: PropTypes.arrayOf(PropTypes.object)
};

export default PriceLossChart;
