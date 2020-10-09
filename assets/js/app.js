// @TODO: YOUR CODE HERE!
svgWidth =960;
svgHeight =500;

var margin={
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
}

var width=svgWidth-margin.left-margin.right
var height=svgHeight-margin.top-margin.bottom
//create svg wrapper, append an svg group that will hold chart

var svg =  d3.select("#scatter")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .classed("chart", true)
var chartGroup=svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial params
var chosenXAxis ="poverty";
var chosenYAxis = "healthcare";

//function used for updating scale variable upon click on axis lable
function xScale(ppData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(ppData, d =>d[chosenXAxis]*0.8), d3.max(ppData, d => d[chosenXAxis]*1.2)])
    .range([0, width]);
    return xLinearScale;
}
function yScale(ppData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
    .domain([0,d3.max(ppData, d => d[chosenYAxis]) 
    ])
    .range([height, 0]);
  return yLinearScale; 
}
//function used for updating Axis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
    return xAxis;
}
function renderYAxes(newYScale, yAxis) {
    var leftAxis=d3.axisLeft(newYScale);
    yAxis.transition()
    .duration(1000)
    .call(leftAxis);
    return yAxis;
}
//function used for updating circles group with a transition to new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
  function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

  function renderlabels(labelsGroup, newXScale, newYScale) {

    labelsGroup.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]))
      .attr("dy", d => newYScale(d[chosenYAxis])+5);
    return labelsGroup;
  }
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  let xLabel,
    yLabel;

  if (chosenXAxis === "poverty") {
    xLabel = "Poverty:";
  }
  else if (chosenXAxis === "age"){
    xLabel = "Age:";
  }
  else {
    xLabel = "Household Income:";
  };

  if (chosenYAxis === "obesity") {
    yLabel = "Obesity:";
  }
  else if (chosenYAxis === "smokes"){
    yLabel = "Smokes:";
  }
  else {
    yLabel = "Healthcare:";
  };

  let toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([10, -10])
    .html(function(d) {
      return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

//read the file and execute everything as below
d3.csv("assets/data/data.csv").then(function(ppData, err){

    if (err) throw err; 
    //parse data
    ppData.forEach(function(data){
        data.poverty=+data.poverty;
        data.healthcare=+data.healthcare;
        data.age=+data.age;
        data.smokes=+data.smokes;
        data.obesity=+data.obesity;
        data.income=+data.income;
    });
// create xLinearScale function
    var xLinearScale =xScale(ppData, chosenXAxis);
    //create y scale function
    var yLinearScale=yScale(ppData, chosenYAxis);

//create initial axis functions:
var bottomAxis= d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

 // append x axis
 var xAxis = chartGroup.append("g")
 // .classed("x-axis", true)
 .attr("transform", `translate(0, ${height})`)
 .call(bottomAxis);

// append y axis
var yAxis = chartGroup.append("g")
 .call(leftAxis);

    // append initial circles
    
    
    var circlesGroup = chartGroup.selectAll("circle")
      .data(ppData)
      .enter()
      .append("circle")
      .classed("stateCircle",true)
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 15)
  
    var labelsGroup = chartGroup.selectAll("text")
      .data(ppData)
      .enter()
      .append("text")
      .classed('stateText',true)
      .attr("dx", d => xLinearScale(d[chosenXAxis]))
      .attr("dy", d => yLinearScale(d[chosenYAxis])+5)
      .text(d => d.abbr)
  
    // Create group for x/y axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)")
    
    var povertyXLabel = xlabelsGroup.append("text")
      .classed('xText', true)
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
    var ageXLabel = xlabelsGroup.append("text")
      .classed('xText', true)
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");
  
    var incomeXLabel = xlabelsGroup.append("text")
      .classed('xText', true)
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");
  
    // append y axis
    var healthCareYLabel = ylabelsGroup.append("text")
      .classed('yText', true)
      .attr("y", 0 - margin.left+50)
      .attr("x", 0 - (height / 2))
      .attr("value", "healthcare")
      .attr("dy", "1em")
      .classed("active", true)
      .text("Lacks Healthcare (%)");
  
    var smokeYLabel = ylabelsGroup.append("text")
      .classed('yText', true)
      .attr("y", 0 - margin.left+45)
      .attr("x", 0 - (height / 2))
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");
  
    var obesityYLabel = ylabelsGroup.append("text")
      .classed('yText', true)
      .attr("y", 0 - margin.left+20)
      .attr("x", 0 - (height / 2))
      .attr("value", "obesity")
      .classed("inactive", true)
      .text("Obese (%)");
  
    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
    // x axis labels event listener
    xlabelsGroup.selectAll(".xText")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(ppData, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
          labelsGroup = renderlabels(labelsGroup,xLinearScale,yLinearScale);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyXLabel
              .classed("active", true)
              .classed("inactive", false);
            ageXLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeXLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "age"){
            povertyXLabel
              .classed("active", false)
              .classed("inactive", true);
            ageXLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeXLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            povertyXLabel
              .classed("active", false)
              .classed("inactive", true);
            ageXLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeXLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  
      ylabelsGroup.selectAll(".yText")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
  
          // replaces chosenXAxis with value
          chosenYAxis = value;
  
          // functions here found above csv import
          // updates y scale for new data
          yLinearScale = yScale(ppData, chosenYAxis);
  
          // updates y axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);
  
          // updates circles with new x values
          circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
          labelsGroup = renderlabels(labelsGroup,xLinearScale,yLinearScale);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenYAxis === "obesity") {
            obesityYLabel
              .classed("active", true)
              .classed("inactive", false);
            smokeYLabel
              .classed("active", false)
              .classed("inactive", true);
            healthCareYLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "smokes"){
            obesityYLabel
              .classed("active", false)
              .classed("inactive", true);
            smokeYLabel
              .classed("active", true)
              .classed("inactive", false);
            healthCareYLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            obesityYLabel
              .classed("active", false)
              .classed("inactive", true);
            smokeYLabel
              .classed("active", false)
              .classed("inactive", true);
            healthCareYLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  }).catch(function(error) {
    console.log(error);
  });
  
