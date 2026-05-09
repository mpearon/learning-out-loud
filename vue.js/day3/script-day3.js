/* 
# Today's Stretch Goals
[X] Validation UI
[X] Edit Run
[X] Sort Runs
[X] Form Default Values

# Long-term Goals
[ ] Add Run Event type
	- Race
	- Training
[ ] Add calculated "PR" indicators to Run Cards
  - Course PR (based on title?)
  - Race Length PR (based on distance)
[ ] Switch to modal window for Add/Edit runs
[ ] Automatically sort by date, but add ability to sort by other headers
*/

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

function addRun(id, title, date, distance, duration) {
	// maybe add constructor for requests lacking an ID?
	console.log(`Adding run ${title}...`);
	if( id === '' ){
		const newRun = {
			id: crypto.randomUUID(),
			title: title,
			date: date,
			distance: distance,
			duration: duration
		};
		runs.push(newRun);
	}
	else{
		const targetRun = runs.find( run => run.id === id )
		targetRun.title = title
		targetRun.date = date
		targetRun.distance = distance
		targetRun.duration = duration
	}
}
function addRandomRun() {
	//console.log('Building random run...');
	addRun(
		'',
		'RandoRun',
		new Date(),
		(Math.floor(Math.random() * 10) + 1),
		(Math.floor(Math.random() * 60) + 15)
	)
}
function getTotals() {
	//console.log('Calculating totals...');
	const result = {
		totalCount: runs.length,
		totalDistance: runs.reduce((sum, run) => { return sum + run.distance }, 0),
		totalDuration: runs.reduce((sum, run) => { return sum + run.duration }, 0)
	};
	return result;
}
function printRuns() {
	//console.log('Printing all runs...');
	runs.forEach(
		run => {
			console.log(`ID: ${run.id}, Date: ${run.date}, Distance: ${run.distance} mi, Duration: ${run.duration} minutes`);
		}
	);
}
function calculateAverageDistance() {
	//console.log('Calculating average distance...');
	const totals = getTotals()
	return (totals.totalDistance / totals.totalCount);
}
function getLongRuns() {
	//console.log('Calculating long runs...');
	return runs.filter(
		run => run.distance > 7
	);
}
function getLongestDurationRun() {
	//console.log('Calculating longest duration run...');
	return runs.reduce(
		(prev, curr) => {
			return (prev.duration > curr.duration) ? prev : curr;
		}
	);
}
function getShortestDurationRun() {
	//console.log('Calculating shortest duration run...');
	return runs.reduce(
		(prev, curr) => {
			return (curr.duration > prev.duration) ? prev : curr;
		}
	);
}
function getSlowestPaceRun() {
	//console.log('Calculating slowest pace run...');
	return runs.reduce(
		(prev, curr) => {
			return (calculatePace(prev) > calculatePace(curr)) ? prev : curr
		}
	);
}
function getFastestPaceRun() {
	//console.log('Calculating fastest pace run...');
	return runs.reduce(
		(prev, curr) => {
			return (calculatePace(curr) > calculatePace(prev)) ? prev : curr
		}
	);
}
function getRunById(id) {
	console.log(`Getting run ${id}...`);
	return runs.find(run => run.id === id);
}
function removeRunById(id) {
	console.log(`Removing run ${id}...`);
	const index = runs.findIndex(run => run.id === id)
	if (index !== -1) {
		runs.splice(index, 1);
	}
}
function getRunsThisYear() {
	//console.log('Calculating runs this year...');
	return runs.filter(
		run => run.date.getFullYear() === (today.getFullYear())
	);
}
function getRunsThisMonth() {
	//console.log('Calculating runs this month...');
	return runs.filter(
		run => run.date.getFullYear() === (today.getFullYear())
			&& run.date.getMonth() === (today.getMonth())
	);
}
function calculatePace(run) {
	//console.log('Calculating pace...');
	return run.duration / run.distance;
}

const today = new Date();
const runListElement = document.querySelector('#run-list')
const totalsUiElement = document.querySelector('#totalsUi')
const addRunBtn = document.querySelector('#add-run-btn')
let count = 1;

addRunBtn.addEventListener('click', function () {
	//console.log(`add-run-btn clicked ${count++} times`)
	addRandomRun();
	renderApp();
}
);
function renderTotals() {
	//console.log('Rendering totals...');
	const totals = getTotals();
	let html = ''
	if (totals.totalCount > 0) {
		html = `
			<div class="run-card-aside">
				<h3>Totals</h3>
				<p>
					Total races: ${totals.totalCount}<br />
					Total distance: ${(totals.totalDistance).toFixed(2)}<br />
					Total duration: ${(totals.totalDuration).toFixed(2)}<br />
				</p>
			</div>
			<div class="run-card-aside">
				<h3>Metrics</h3>
				<p>
					Fastest Pace: ${getFastestPaceRun().title}<br />
					Slowest Pace: ${getSlowestPaceRun().title}<br />
					Longest Duration: ${getLongestDurationRun().title}<br />
					Shortest Duration: ${getShortestDurationRun().title}<br />
				</p>
			</div>
		`
	}
	else {
		html = 'No records are available'
	}
	totalsUiElement.innerHTML = html;
}
function renderRuns( sortProperty = 'date' ) {
	//console.log('Rendering runs...');
	let html = '';
	const sortedRuns = runs.toSorted( ( a, b ) => a[sortProperty] - b[sortProperty]);
	sortedRuns.forEach(
		run => {
			html += `
				<div class="run-card">
					<div class="run-card-aside">
						<h3> ${run.title} </h3>
						<p>
							Date: ${run.date.getFullYear()}-${(run.date.getMonth() + 1).toString().padStart(2, '0')}-${(run.date.getDate()).toString().padStart(2, '0')}<br />
							Duration: ${(run.duration).toFixed(2)}min<br />
							Distance: ${(run.distance).toFixed(2)}mi<br />
							Pace: ${(calculatePace(run)).toFixed(2)}<br />
						</p>
					</div>
					<div class="run-card-aside small">
						<button class="deleteRunButton" data-id="${run.id}">
							Delete
						</button>
						<br />
						<button class="editRunButton" data-id="${run.id}">
							Edit
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
				'click', function () {
					const id = button.dataset.id;
					removeRunById(id);
					renderApp();
				}
			)
		}
	);
	const editButtons = document.querySelectorAll('.editRunButton')
	editButtons.forEach(
		button => {
			button.addEventListener(
				'click', function(){
					const id = button.dataset.id;
					// populate form with info from run, then edit vs. recreating
					const form = document.forms['add-run-form'];
					const targetRun = runs.find( run => run.id === id )
					form['id'].value = targetRun.id;
					form['title'].value = targetRun.title;
					form['date'].valueAsDate = new Date( targetRun.date );
					form['distance'].value = targetRun.distance;
					form['duration'].value = targetRun.duration;
				}
			)
		}
	);
}

function validateField(input, value, type) {
	let isValid = true;
	switch (type) {
		case 'number':
			isValid = value >= 1;
			break;
		case 'text':
			isValid = value.trim() !== '';
			break;
		case 'date':
			isValid = value.trim() !== '';
			break;
	}
	isValid
		? input.classList.remove('invalid')
		: input.classList.add('invalid')
	return isValid;
}

function renderApp() {
	renderRuns();
	renderTotals();
}

const addRunForm = document.querySelector('#add-run-form')
addRunForm.addEventListener(
	'submit',
	function (event) {
		console.log('Form submitted');
		event.preventDefault();
		
		const form = event.target;
		
		let formIsValid = true;
		Array.from( form.elements ).forEach(
			element => {
				if( element.tagName !== 'INPUT' || element.name === 'id' ){ return; }
				const isValid = validateField(element, element.value, element.type);
				if (!isValid) {
					formIsValid = false;
				}
			}
		);
		if (!formIsValid) {
			alert('Error in fields');
			return;
		}
		
		const formData = new FormData(form);
		const values = Object.fromEntries(formData.entries());
		addRun(
			values.id,
			values.title,
			new Date(values.date),
			parseFloat(values.distance),
			parseFloat(values.duration)
		);
		form.reset();
		renderApp();
	}
);

renderApp();
