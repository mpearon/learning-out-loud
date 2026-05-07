const runs = [
	{
		id: 'c162e6e5-6288-4444-b5da-c7ae562ca0f5',
		title: '5K for the Cure',
		date: new Date(2026, 4, 1),
		distance: 3.1,
		duration: 30
	},
	{
		id: '9e2fba33-3027-4a62-88ed-29158a641f87',
		title: 'Tim "Tool Man" Taylor\'s 10K',
		date: new Date(2026, 4, 2),
		distance: 6.2,
		duration: 60
	},
	{
		id: '235431db-3988-4c57-a3cf-b619dfe2db3c',
		title: 'Holly Flax\'s Half Marathon',
		date: new Date(2025, 5, 1),
		distance: 13.1,
		duration: 120
	},
	{
		id: '5a9c01d0-5b75-4226-a3b0-091a45e7d2f4',
		title: 'Danny Tanner\'s Full (House) Full Marathon',
		date: new Date(2026, 3, 3),
		distance: 26.2,
		duration: 240
	}
];

function addRun(title, date, distance, duration) {
	console.log(`Adding run ${ title }...`);
	const newRun = {
		id: crypto.randomUUID(),
		title: title,
		date: date,
		distance: distance,
		duration: duration
	};

	runs.push(newRun);
}
function addRandomRun(){
	console.log('Building random run...');
	addRun(
		'RandoRun',
		new Date(),
		(Math.floor(Math.random() * 10) + 1),
		(Math.floor(Math.random() * 60) + 15)
	)
}
function getTotals() {
	console.log('Calculating totals...');
	const result = {
		totalCount: runs.length,
		totalDistance: runs.reduce((sum, run) => { return sum + run.distance }, 0),
		totalDuration: runs.reduce((sum, run) => { return sum + run.duration }, 0)
	};
	return result;
}
function printRuns() {
	console.log('Printing all runs...');
	runs.forEach(
		run => {
			console.log(`ID: ${run.id}, Date: ${run.date}, Distance: ${run.distance} mi, Duration: ${run.duration} minutes`);
		}
	);
}
function calculateAverageDistance() {
	console.log('Calculating average distance...');
	const totals = getTotals()
	return (totals.totalDistance / totals.totalCount);
}
function getLongRuns() {
	console.log('Calculating long runs...');
	return runs.filter(
		run => run.distance > 7
	);
}
function getLongestDurationRun() {
	console.log('Calculating longest duration run...');
	return runs.reduce(
		(prev, curr) => {
			return (prev.duration > curr.duration) ? prev : curr;
		}
	);
}
function getShortestDurationRun() {
	console.log('Calculating shortest duration run...');
	return runs.reduce(
		(prev, curr) => {
			return (curr.duration > prev.duration) ? prev : curr;
		}
	);
}
function getSlowestPaceRun() {
	console.log('Calculating slowest pace run...');
	return runs.reduce(
		(prev, curr) => {
			return ( calculatePace(prev) > calculatePace(curr) ) ? prev : curr
		}
	);
}
function getFastestPaceRun() {
	console.log('Calculating fastest pace run...');
	return runs.reduce(
		(prev, curr) => {
			return ( calculatePace(curr) > calculatePace(prev) ) ? prev : curr
		}
	);
}
function getRunById(id) {
	console.log(`Getting run ${ id }...`);
	return runs.find(run => run.id === id);
}
function removeRunById(id) {
	console.log(`Removing run ${ id }...`);
	const index = runs.findIndex( run => run.id === id )
	if( index !== -1){
		runs.splice(index,1);
	}
}
function getRunsThisYear() {
	console.log('Calculating runs this year...');
	return runs.filter(
		run => run.date.getFullYear() === (today.getFullYear())
	);
}
function getRunsThisMonth() {
	console.log('Calculating runs this month...');
	return runs.filter(
		run => run.date.getFullYear() === (today.getFullYear())
			&& run.date.getMonth() === (today.getMonth())
	);
}
function calculatePace( run ) {
	console.log('Calculating pace...');
	return run.duration / run.distance;
}

const today = new Date();
const runListElement = document.querySelector('#run-list')
const totalsUiElement = document.querySelector('#totalsUi')
console.log( runListElement );

runListElement.innerHTML = `
	<div class='run-card'>
		Test Run
	</div>
`;

const addRunBtn = document.querySelector('#add-run-btn')
let count = 1;
addRunBtn.addEventListener( 'click', function(){
		console.log( `add-run-btn clicked ${ count++ } times` )
		addRandomRun();
		renderRuns();
		renderTotals();
	}
);
function renderTotals(){
	console.log('Rendering totals...');
	const totals = getTotals();
	let html = ''
	if( totals.totalCount > 0 ){
		html = `
			<div class="run-card-aside">
				<h3>Totals</h3>
				<p>
					Total races: ${ totals.totalCount }<br />
					Total distance: ${ (totals.totalDistance).toFixed(2) }<br />
					Total duration: ${ (totals.totalDuration).toFixed(2) }<br />
				</p>
			</div>
			<div class="run-card-aside">
				<h3>Metrics</h3>
				<p>
					Fastest Pace: ${ getFastestPaceRun().title }<br />
					Slowest Pace: ${ getSlowestPaceRun().title }<br />
					Longest Duration: ${ getLongestDurationRun().title }<br />
					Shortest Duration: ${ getShortestDurationRun().title }<br />
				</p>
			</div>
		`
	}
	else{
		html = 'No records are available'
	}
	totalsUiElement.innerHTML = html;
}
function renderRuns(){
	console.log('Rendering runs...');
	let html = '';
	runs.forEach(
		run => {
			html += `
				<div class="run-card">
					<div class="run-card-aside">
						<h3> ${ run.title } </h3>
						<p>
							Date: ${ run.date.getFullYear() }-${ (run.date.getMonth()+1).toString().padStart(2,'0') }-${ run.date.getDate().toString().padStart(2,'0') }<br />
							Duration: ${ (run.duration).toFixed(2) }min<br />
							Distance: ${ (run.distance).toFixed(2) }mi<br />
							Pace: ${ (calculatePace( run )).toFixed(2) }<br />
						</p>
					</div>
					<div class="run-card-aside small">
						<button class="deleteRunButton" data-id="${ run.id }">
							Delete
						</button>
					</div>
				</div>
			`
		}
	);
	runListElement.innerHTML = html;
	const deleteButtons = document.querySelectorAll('.deleteRunButton')
	deleteButtons.forEach(
		button => {
			button.addEventListener( 
				'click', function() {
					const id = button.dataset.id;
					removeRunById( id );
					renderRuns();
					renderTotals();
				}
			)
		}
	);
}

renderRuns();
renderTotals();


