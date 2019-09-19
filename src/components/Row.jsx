import React, { Component } from 'react';

const Row = (props) => (
    <tr>
    <th scope="row" key={props.datetime}>{props.datetime}</th>
    <td key={props.type}>{props.type}</td>
    <td key={props.name}>{props.name}</td>
    <td key={props.message}>{props.message}</td>
    <td key={props.source}>{props.source}</td>
  </tr>
);

export default Row;
