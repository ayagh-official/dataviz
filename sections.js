let dataset, svg
let salarySizeScale, salaryXScale, categoryColorScale
let simulation, nodes
let categoryLegend, salaryLegend

const categories = ['Africa', 'Asia', 'Latin America and the Caribbean', 'Oceania', 'Europe']

const categoriesXY = {'Africa': [0, 400, 57382, 23.9],
                        'Asia': [0, 600, 43538, 48.3],
                        'Latin America and the Caribbean': [0, 800, 41890, 50.9],
                        'Oceania': [0, 200, 42200, 48.3],
                        'Europe': [200, 400, 42745, 31.2]}

const margin = {left: 170, top: 50, bottom: 50, right: 20}
const width = 1000 - margin.left - margin.right
const height = 920 - margin.top - margin.bottom

//Read Data, convert numerical categories into floats
//Create the initial visualisation


d3.csv('https://ayagh-official.github.io/dataviz/data_dir/Food_Pov8.csv', function(d){
    return {
        Major: d.Major,
        Total: +d.Total,
        Men: +d.Men,
        Women: +d.Women,
        Median: +d.Median,
        //Unemployment: +d.Unemployment_rate,
        Category: d.Major_category,
        ShareWomen: +d.ShareWomen, 
        HistCol: +d.Histogram_column,
        Midpoint: +d.midpoint,
        Sample: +d.sample
    };
}).then(data => {
    dataset = data
    console.log(dataset)
    createScales()
    setTimeout(drawInitial(), 100)
})

const colors = ['#ffcc00', '#65587f', '#66cccc', '#0c7b93', '#d43182']

//Create all the scales and save to global variables

function createScales(){
    salarySizeScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [5, 35])
    salaryXScale = d3.scaleLinear(d3.extent(dataset, d => d.Median), [margin.left, margin.left + width+250])
    salaryYScale = d3.scaleLinear([5, 70], [margin.top + 700, margin.top])
    categoryColorScale = d3.scaleOrdinal(categories, colors)
    shareWomenXScale = d3.scaleLinear(d3.extent(dataset, d => d.ShareWomen), [margin.left, margin.left + width])
    enrollmentScale = d3.scaleLinear(d3.extent(dataset, d => d.Total), [margin.left + 120, margin.left + width - 50])
    enrollmentSizeScale = d3.scaleLinear(d3.extent(dataset, d=> d.Total), [10,60])
    histXScale = d3.scaleLinear(d3.extent(dataset, d => d.Midpoint), [100, 0 + 1600])
    histYScale = d3.scaleLinear(d3.extent(dataset, d => d.HistCol), [margin.top + height, 550])
}

function createLegend(x, y){
    let svg = d3.select('#legend')

    svg.append('g')
        .attr('class', 'categoryLegend')
        .attr('transform', `translate(${x},${y})`)

    categoryLegend = d3.legendColor()
                            .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
                            .shapePadding(10)
                            .scale(categoryColorScale)
    
    d3.select('.categoryLegend')
        .call(categoryLegend)
}
// function createLegend2(x, y) {
//     let svg = d3.select('#legend2');

//     svg.append('g')
//         .attr('class', 'categoryLegend2')
//         .attr('transform', `translate(${x},${y})`);

//     const symbols = [
//         d3.symbol().type(d3.symbolTriangle).size(150)(),
//         d3.symbol().type(d3.symbolCircle).size(150)(),
//         d3.symbol().type(d3.symbolCircle).size(150).foreground('mintcream')()
//     ];

//     categoryLegend2 = d3.legendColor()
//         .shape('path', symbols)
//         .shapePadding(10)
//         .scale(categoryColorScale);

//     d3.select('.categoryLegend2')
//         .call(categoryLegend2);
// }

function createSizeLegend(){
    let svg = d3.select('#legend2')
    // svg.append('g')
    // .attr('class', 'categoryLegend2')
    // .attr('transform', `translate(${x},${y})`);

    // const symbols = [
    //     d3.symbol().type(d3.symbolTriangle).size(150)(),
    //     d3.symbol().type(d3.symbolCircle).size(150)(),
    //     d3.symbol().type(d3.symbolCircle).size(150).foreground('mintcream')()
    // ];

    // categoryLegend2 = d3.legendColor()
    // .shape('path', symbols)
    // .shapePadding(10)
    // .scale(categoryColorScale);

    // d3.select('.categoryLegend2')
    // .call(categoryLegend2);


    // svg.append('g')
    //     .attr('class', 'sizeLegend')
    //     .attr('transform', `translate(100,50)`)

    // sizeLegend2 = d3.legendSize()
    //     //.scale(salarySizeScale)
    //     .shape('circle')
    //     .shapePadding(15)
    //     .title('Gender Encoding')
    //     //.labelFormat(d3.format(",.2r"))
    //     .cells(7)

    // d3.select('.sizeLegend')
    //     .call(sizeLegend2)
}

function createSizeLegend2(){
    let svg = d3.select('#legend3')
    // svg.append('g')
    //     .attr('class', 'sizeLegend2')
    //     .attr('transform', `translate(50,100)`)

    // sizeLegend2 = d3.legendSize()
    //     .scale(enrollmentSizeScale)
    //     .shape('circle')
    //     .shapePadding(55)
    //     .orient('horizontal')
    //     .title('Geneder Encoding')
    //     .labels(['Female', 'Balance', 'Male'])
    //     .labelOffset(30)
    //     .cells(3)

    // d3.select('.sizeLegend2')
    //     .call(sizeLegend2)
}


// Define shapes for the legend
const shapes = ['triangle', 'circle', 'square'];

// Set colors for each shape
const shapeColors = {
    'triangle': 'black',
    'circle': '#b5c8bc', // Color for the 'Balance' legend
    'square': 'black'
};

// Create an ordinal scale for the legend
const legendScale = d3.scaleOrdinal()
    .domain(['Female', 'Balance', 'Male'])
    .range(shapes);

function createShapeLegend() {
    let svg = d3.select('#legend3');
    svg.append('g')
        .attr('class', 'shapeLegend')
                .attr('transform', 'translate(50, 100)');

    // Create shapes for the legend
    const legendShapes = d3.select('.shapeLegend')
        .selectAll('path')
        .data(['Female', 'Balance', 'Male'])
        .enter()
        .append('path')
        .attr('transform', (d, i) => `translate(${i * 100}, 0)`) // Increase the spacing
        .attr('d', d => {
            // Define the path data for each shape
            return d3.symbol().type(d3[`symbol${legendScale(d).charAt(0).toUpperCase()}${legendScale(d).slice(1)}`]).size(200)();
        })
        .attr('fill', d => shapeColors[legendScale(d)]); // Assign specific color based on the legend item

    // Create labels for the legend
    const legendLabels = d3.select('.shapeLegend')
        .selectAll('text')
        .data(['High F Rate ', '  Balance     ', 'High M Rate'])
        .enter()
        .append('text')
        .attr('x', (d, i) => i * 95 -20) // Adjust the position as needed
        .attr('y', 40) // Adjust the position as needed
        .text(d => d)
        .style('font-size', '14px'); // Adjust the font size as needed
}

// Call the function to create the legend with shapes
createShapeLegend();





// All the initial elements should be create in the drawInitial function
// As they are required, their attributes can be modified
// They can be shown or hidden using their 'opacity' attribute
// Each element should also have an associated class name for easy reference

function drawInitial(){
    createSizeLegend()
    createSizeLegend2()

    let svg = d3.select("#vis")
                    .append('svg')
                    .attr('width', 1000)
                    .attr('height',950)
                    .attr('opacity', 1)

    let xAxis = d3.axisBottom(salaryXScale)
                    .ticks(4)
                    .tickSize(height + 80)

    let xAxisGroup = svg.append('g')
        .attr('class', 'first-axis')
        .attr('transform', 'translate(0, 0)')
        .call(xAxis)
        .call(g => g.select('.domain')
            .remove())
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-dasharray', 2.5)

    // Instantiates the force simulation
    // Has no forces. Actual forces are added and removed as required

    simulation = d3.forceSimulation(dataset)

     // Define each tick of simulation
    simulation.on('tick', () => {
        nodes
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
    })

    // Stop the simulation until later
    simulation.stop()

    // Selection of all the circles 
    nodes = svg
        .selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
            .attr('fill', 'black')
            .attr('r', 3)
            .attr('cx', (d, i) => salaryXScale(d.Median) + 5)
            .attr('cy', (d, i) => i * 5.2 + 30)
            .attr('opacity', 0.8)
        
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('circle')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)

    function mouseOver(d, i){

        console.log('hi')
        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 5)
            .attr('stroke', '#FFD700')
            
        d3.select('#tooltip')
            .style('left', (d3.event.pageX + 10)+ 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(`
                <strong>Country:</strong> ${d.Major[0] + d.Major.slice(1,).toLowerCase()} <br>
                <strong>Median Poverty Percentage:</strong> ${d3.format(",.2r")(d.Median)}% 
                <br> <strong>F/M ratio:</strong> ${Math.round(d.ShareWomen*100)}% / ${100-Math.round(d.ShareWomen*100)}%
                <br> <strong>Sample Size:</strong> ${d3.format(",.2r")(d.Sample)}
                `)
    }
    
    function mouseOut(d, i){
        d3.select('#tooltip')
            .style('display', 'none')

        d3.select(this)
            .transition('mouseout').duration(100)
            .attr('opacity', 0.8)
            .attr('stroke-width', 0)
    }

    //Small text label for first graph
    svg.selectAll('.small-text')
        .data(dataset)
        .enter()
        .append('text')
            .text((d, i) => d.Major.toLowerCase())
            .attr('class', 'small-text')
            .attr('x', margin.left)
            .attr('y', (d, i) => i * 5.2 + 30)
            .attr('font-size', 7)
            .attr('text-anchor', 'end')
    
    //All the required components for the small multiples charts
    //Initialises the text and rectangles, and sets opacity to 0 
    svg.selectAll('.cat-rect')
        .data(categories).enter()
        .append('rect')
            .attr('class', 'cat-rect')
            .attr('x', d => categoriesXY[d][0] + 120 + 1000)
            .attr('y', d => categoriesXY[d][1] + 30)
            .attr('width', 160)
            .attr('height', 30)
            .attr('opacity', 0)
            .attr('fill', 'grey')


    svg.selectAll('.lab-text')
        .data(categories).enter()
        .append('text')
        .attr('class', 'lab-text')
        .attr('opacity', 0)
        .raise()

    svg.selectAll('.lab-text')
        .text(d => `Average: $${d3.format(",.2r")(categoriesXY[d][2])}`)
        .attr('x', d => categoriesXY[d][0] + 200 + 1000)
        .attr('y', d => categoriesXY[d][1] - 500)
        .attr('font-family', 'Domine')
        .attr('font-size', '12px')
        .attr('font-weight', 700)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')       

    svg.selectAll('.lab-text')
            .on('mouseover', function(d, i){
                d3.select(this)
                    .text(d)
            })
            .on('mouseout', function(d, i){
                d3.select(this)
                    .text(d => `Average: $${d3.format(",.2r")(categoriesXY[d][2])}`)
            })


    // Best fit line for gender scatter plot

    const bestFitLine = [{x: 0.5, y: 0}, {x: 0.5, y: 100}]
    const lineFunction = d3.line()
                            .x(d => shareWomenXScale(d.x))
                            .y(d => salaryYScale(d.y))

    // Axes for Scatter Plot
    svg.append('path')
        .transition('best-fit-line').duration(430)
            .attr('class', 'best-fit')
            .attr('d', lineFunction(bestFitLine))
            .attr('stroke', 'red')
            .attr('stroke-dasharray', 9.2)
            .attr('opacity', .05)
            .attr('stroke-width', 5)

    let scatterxAxis = d3.axisBottom(shareWomenXScale).tickFormat(d3.format('.0r'))
    let scatteryAxis = d3.axisLeft(salaryYScale).tickSize([width])

    svg.append('g')
        .call(scatterxAxis)
        .attr('class', 'scatter-x')
        .attr('opacity', 0)
        .style('font-size', '17px')
        .attr('transform', `translate(0, ${height + margin.top})`)
        .call(g => g.select('.domain')
            .remove())
    
    svg.append('g')
        .call(scatteryAxis)
        .attr('class', 'scatter-y')
        .attr('opacity', 0)
        .style('font-size', '17px')
        .attr('transform', `translate(${margin.left - 20 + width}, 0)`)
        .call(g => g.select('.domain')
            .remove())
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-dasharray', 2.5)

// Axes for Histogram
let histxAxis = d3.axisBottom(enrollmentScale);

svg.append('g')
    .attr('class', 'enrolment-axis')
    .attr('transform', 'translate(0, 700)')
    .attr('opacity', 0)
    .call(histxAxis)
    .selectAll('text')  // Select all the text elements of the axis
    .style('font-size', '27px');  // Set the font size as needed


}

//Cleaning Function
//Will hide all the elements which are not necessary for a given chart type 

function clean(chartType){
    let svg = d3.select('#vis').select('svg')
    if (chartType !== "isScatter") {
        svg.select('.scatter-x').transition().attr('opacity', 0)
        svg.select('.scatter-y').transition().attr('opacity', 0)
        svg.select('.best-fit').transition().duration(200).attr('opacity', 0)
        svg.select('.y-axis-label').remove();   
    }
    if (chartType !== "isMultiples"){
        svg.selectAll('.lab-text').transition().attr('opacity', 0)
            .attr('x', 1800)
        svg.selectAll('.cat-rect').transition().attr('opacity', 0)
            .attr('x', 1800)
    }
    if (chartType !== "isFirst"){
        svg.select('.first-axis').transition().attr('opacity', 0)
        svg.selectAll('.small-text').transition().attr('opacity', 0)
            .attr('x', -200)
    }
    if (chartType !== "isHist"){
        svg.selectAll('.hist-axis').transition().attr('opacity', 0)
                
    }
    // if (chartType !== "isBubble"){
    //     svg.select('.enrolment-axis').transition().attr('opacity', 0)
    // }
}


function draw2(){
   
    createLegend(20, 50)
}


//First draw function

function draw1() {
    // Stop simulation
    simulation.stop();

    // Take the first 10 records from the dataset
    let slicedData = dataset.slice(0, 50);

    // Hide the SVG
    d3.select("#vis").select('svg').style('display', 'none');

    // Show the cover image
    d3.select("#coverImage").style('display', 'block');

    // Clean up as needed
    clean('isFirst');

    // Additional transitions or actions if required
}





function draw5(){
    
    let svg = d3.select('#vis').select('svg')
    clean('isMultiples')

    simulation
        .force('forceX', d3.forceX(d => categoriesXY[d.Category][0] + 200))
        .force('forceY', d3.forceY(d => categoriesXY[d.Category][1] - 50))
        .force('collide', d3.forceCollide(d => salarySizeScale(d.Median) + 4))

    simulation.alpha(1).restart()
   
    svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
        .text(d => `% Female: ${(categoriesXY[d][3])}%`)
        .attr('x', d => categoriesXY[d][0] + 200)   
        .attr('y', d => categoriesXY[d][1] + 50)
        .attr('opacity', 1)
    
    svg.selectAll('.lab-text')
        .on('mouseover', function(d, i){
            d3.select(this)
                .text(d)
        })
        .on('mouseout', function(d, i){
            d3.select(this)
                .text(d => `% Female: ${(categoriesXY[d][3])}%`)
        })
   
    svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
        .attr('opacity', 0.2)
        .attr('x', d => categoriesXY[d][0] + 120)

    svg.selectAll('circle')
        .transition().duration(400).delay((d, i) => i * 4)
            .attr('fill', colorByGender)
            .attr('r', d => salarySizeScale(d.Median))

}


function draw6(){
    simulation.stop()
    
    let svg = d3.select("#vis").select("svg")
    clean('isScatter')

    svg.selectAll('.scatter-x').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
    svg.selectAll('.scatter-y').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)

    svg.selectAll('circle')
        .transition().duration(800).ease(d3.easeBack)
        .attr('cx', d => shareWomenXScale(d.ShareWomen))
        .attr('cy', d => salaryYScale(d.Median))
    
    svg.selectAll('circle').transition(1600)
        .attr('fill', colorByGender)
        .attr('r', 12)
        
    //     // Set fill color specifically for triangles
    // svg.selectAll('circle')
    //     .filter(d => shapeByGender(d) === 'triangle')
    //     .attr('fill', 'blue');

    svg.select('.best-fit').transition().duration(300)
        .attr('opacity', 0.5)
        
    svg.append('defs');

        // Append patterns to the SVG
    svg.select('defs')
    .selectAll('pattern')
    .data(['triangle-pattern', 'circle-pattern', 'square-pattern'])
    .enter()
    .append('pattern')
    .attr('id', d => d)
    .attr('width', 8)
    .attr('height', 8)
    .attr('patternUnits', 'userSpaceOnUse')
    .append('path')
    .attr('d', d => {
        if (d === 'triangle-pattern') {
            return 'M 4 0 L 8 8 L 0 8 Z'; // Triangle path
        } else if (d === 'circle-pattern') {
            return 'M 4 4 m -4, 0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0'; // Circle path
        } else {
            return 'M 0 0 H 8 V 8 H 0 Z'; // Square path
        }
    });
}

function shapeByGender(d, i){
    if (d.ShareWomen < 0.49){
        return 'triangle'
    } else if (d.ShareWomen > 0.51) {
        return 'circle'
    } else {
        return 'square'
    }
}

function colorByGender(d, i){
    let shape = shapeByGender(d, i);

    // Set the appropriate shape based on the gender
    if (shape === 'triangle') {
        return 'url(#triangle-pattern)'     ;
    } else if (shape === 'circle') {
        return 'url(#circle-pattern)';
    } else {
        return '#a5bDAF';
    }
}



function draw4(){
    let svg = d3.select('#vis').select('svg')

    clean('isHist')

    simulation.stop()

    svg.selectAll('circle')
        .transition().duration(600).delay((d, i) => i * 2).ease(d3.easeBack)
            .attr('r', 13)
            .attr('cx', d => histXScale(d.Midpoint))
            .attr('cy', d => histYScale(d.HistCol))
            .attr('fill', d => categoryColorScale(d.Category))

    let xAxis = d3.axisBottom(histXScale)
    svg.append('g')
        .attr('class', 'hist-axis')
        .attr('transform', `translate(0, ${height + margin.top + 10})`)
        .call(xAxis)
        .selectAll('text')  // Select all the text elements of the axis
        .style('font-size', '17px');  // Set the font size as needed
    // Adding X-axis label
    svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'end')  // Center the label
        .attr('x', margin.left + width )
        .attr('y', height + margin.top + 60)  // Adjust the vertical position as needed
        .style('font-size', '17px')
        .text('National percentage');

    let yAxis = d3.axisLeft(histYScale).tickFormat(d3.format('d')); // Format tick labels as abbreviated numbers (e.g., 1.5k)
    svg.append('g')
        .attr('class', 'hist-axis')
        .attr('transform', `translate(${margin.left - 90}, 0)`)
        .call(yAxis)
        .selectAll('text')  // Select all the text elements of the y-axis
        .style('font-size', '17px');  // Set the font size as needed

    // Label for the y-axis
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 )
        .attr('x', 0 - ((height + margin.top)) / 1.5)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '17px')  // Set the font size as needed
        .text('Total');
    
    svg.selectAll('.lab-text')
        .on('mouseout', )
}



//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [

    //draw1,
    draw2,
    draw4,
    draw6, 
    //draw5 

]

//All the scrolling function
//Will draw a new graph based on the index provided by the scroll


let scroll = scroller()
    .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress){
    if (index == 1 & progress > 0.1){

    }
})