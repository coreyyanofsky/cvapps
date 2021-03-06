// Put code in an Immediately Invoked Function Expression (IIFE).
// This isn't strictly necessary, but it's good JavaScript hygiene.
(function() {
  
    const milliseconds = 2 * 31540000000;

// See http://rstudio.github.io/shiny/tutorial/#building-outputs for
// more information on creating output bindings.

// First create a generic output binding instance, then overwrite
// specific methods whose behavior we want to change.
    var binding = new Shiny.OutputBinding();

    binding.find = function(scope) {
  // For the given scope, return the set of elements that belong to
  // this binding.
	return $(scope).find(".nvd3-linechart");
    };

    binding.renderValue = function(el, data) {
  // This function will be called every time we receive new output
  // values for a line chart from Shiny. The "el" argument is the
  // div for this particular chart.
  
	var $el = $(el);
    
  // The first time we render a value for a particular element, we
  // need to initialize the nvd3 line chart and d3 selection. We'll
  // store these on $el as a data value called "state".
	if (!$el.data("state")) {
	    var chart = nv.models.multiBarChart()
		.margin({left: 100})
		.transitionDuration(350)
		.showLegend(true)
		.showYAxis(true)
		.showXAxis(true)
		.reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
		.rotateLabels(0)      //Angle to rotate x-axis labels.
		.showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
		.groupSpacing(0.1)    //Distance between each group of bars.
		.stacked(true);
        /*
        const dataLength = data[0].values.length;
        
        const rangeMin = data[0].values[0].x;
        const rangeMax = data[0].values[dataLength - 1].x;
        
        const timeMax = new Date(rangeMax);
        const timeMin = new Date(rangeMin);
        
        const diff = timeMax.valueOf() - timeMin.valueOf();
        
        console.log(diff);
        //console.log(rangeMin, rangeMax);
    */
     
    chart.xAxis     //Chart x-axis settings
		.axisLabel('Time');
      //.tickFormat(function(d) { return d3.time.format('%b %Y')(new Date(d + 1)); });
      //.tickFormat(d3.format('d'));
 
    chart.yAxis     //Chart y-axis settings
		.axisLabel('Number of Reports')
		.tickFormat(d3.format('d'));
      

	    nv.utils.windowResize(chart.update);
    
	    var selection = d3.select(el).select("svg");
    
    // Store the chart object on el so we can get it next time
	    $el.data("state", {
		chart: chart,
		selection: selection,
      
	    });
	}
  
  // Now, the code that'll run every time a value is rendered...
  
  // Retrieve the chart and selection we created earlier
	var state = $el.data("state");
  // Schedule some work with nvd3
	nv.addGraph(function() {
    // Update the chart
    state.selection
		.datum(data)
		.transition(500)
		.call(state.chart);
	    return state.chart;
	});
    };

// Tell Shiny about our new output binding
    Shiny.outputBindings.register(binding, "shinyjsexamples.nvd3-linechart");

})();
