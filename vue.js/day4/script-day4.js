/* 
# Today's Goals

[x] Part 1 - Persistence with localStorage
     [x] Step 1 - Understand localStorage
     [x] Step 2 - Create saveRuns()
     [x] Step 3 - Save after mutations
     [x] Step 4 - Create loadRuns()
     [x] Step 5 - Initialize app state

--- Pause Point 1 ---

[x] Part 2 - App Initialization Architecture
     [x] Step 1 - Create initApp()
     [x] Step 2 - Introduce App State Thinking

[X] Part 3 - Filtering
     [X] Step 1 - Add Filter Dropdown
     [X] Step 2 - Capture Filter Element
     [X] Step 3 - Add getFilteredRuns()
     [X] Step 4 - Update renderRuns()
     [X] Step 5 - Re-render on filter change

--- Pause Point 2 ---

[X] Part 4 - Advanced Sorting
     [X] Step 1 - Add Sort Dropdown
     [X] Step 2 - Capture Sort Element
     [X] Step 3 - Add Sorting Logic
     [X] Step 4 - Re-render on sort change

[X] Part 5 - Empty States
     [X] Step 1 - Add Empty List UI

--- Pause Point 3 ---

[X] Part 6 - Refactoring Repetition
     [X] Step 1 - Extract Date Formatter
     [X] Step 2 - Extract Pace Formatter
     [X] Step 3 - Introduce “Utility Function” Thinking

# Today's Stretch Goals

[X] Stretch Goal #1 - Clear All Runs
[X] Stretch Goal #2 - Persist Filter/Sort Settings
[X] Stretch Goal #3 - Reusable Sorting Helper
[X] Stretch Goal #4 - Delete Confirmation Modal

# Long-term Goals
[ ] Add Run Event type
	- Race
	- Training
[ ] Add calculated "PR" indicators to Run Cards
  - Course PR (based on title?)
  - Race Length PR (based on distance)
[ ] Switch to modal window for Add/Edit runs
[ ] Automatically sort by date, but add ability to sort by other headers
	- Handled in Day 4, Part 4
[ ] Add SSO integration
	- Store run entries with username
[ ] Indicate Filtered List
	- If a filter is active, indicate in the UI
[ ] Indicate Sorted List
	- If a sort is active, indicate in the UI
[ ] Allow custom notes
	- Work with SSO integration
	- Allow user to add custom notes, storing in hash table
		- This would be stored with profile
		- Read on run load, rendering a new named field in the details view
		- Edit complications
*/
const runs = [];
const starterRuns = [
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

function addRun({ id, title, date, distance, duration } = {}) {
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
	saveRuns();
}
function removeRunById(id) {
	console.log(`Removing run ${id}...`);
	const index = runs.findIndex(run => run.id === id)
	if (index !== -1) {
		runs.splice(index, 1);
	}
	saveRuns();
}
function saveRuns(){
	localStorage.setItem(
		'runs',
		JSON.stringify( runs )
	);
}
function saveSetting( { settingName, settingValue } = {} ){
	localStorage.setItem(
		settingName,
		settingValue
	);
}
function loadRuns(){
	const storedRuns = localStorage.getItem( 'runs' );
	if( storedRuns === null ){
		starterRuns.forEach(
			run =>{
				runs.push( run );
			}
		);
		saveRuns();
		return;
	}
	const parsedRuns = JSON.parse( storedRuns );
	runs.length = 0;
	parsedRuns.forEach(
		run => {
			runs.push({
				...run,
				date: new Date( run.date )
			})
		}
	);
}
function loadSetting({ control, settingName } = {}){
	const storedSettingValue = localStorage.getItem( settingName );
	if( storedSettingValue !== null ){
		control.value = storedSettingValue;
	}
}
function addRandomRun() {
	//console.log('Building random run...');
	const today = new Date();
	addRun({
		id: '',
		title: 'RandoRun',
		date: new Date( today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() ),
		distance: (Math.floor(Math.random() * 10) + 1),
		duration: (Math.floor(Math.random() * 60) + 15)
	})
}
function clearAllRuns(){
	runs.length = 0;
	saveRuns();
	renderApp();
}
function appInit(){
	loadRuns();
	renderApp();
}
function formatDate( date ) {
	return `
		${ date.getFullYear() }-${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${date.getDate()
		.toString()
		.padStart(2, '0')}
	`;
}
function formatNumber( number ){
	return number.toFixed(2);
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
			console.log(`ID: ${run.id}, Date: ${ formatDate( run.date ) }, Distance: ${run.distance} mi, Duration: ${run.duration} minutes`);
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
					Total distance: ${ formatNumber( totals.totalDistance ) }<br />
					Total duration: ${ formatNumber( totals.totalDuration ) }<br />
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
function compareRuns(a, b, property) {
	if (property === 'title') {
		return a.title.localeCompare(b.title);
	}
	return a[property] - b[property];
}
function renderRuns( { sortProperty = 'date', filterProperty = 'All' } = {} ) {
	//console.log('Rendering runs...');
	let html = '';
	const filteredRuns = getFilteredRuns( filterProperty );
	const sortedRuns = filteredRuns.toSorted(
		(a, b) => compareRuns(a, b, sortProperty)
	);
	if( sortedRuns.length < 1 ){
		html = `
			<div class="run-card">
				No runs match this filter.
			</div>
		`;
	}
	else{
		sortedRuns.forEach(
			run => {
				html += `
					<div class="run-card">
						<div class="run-card-aside">
							<h3> ${ run.title } </h3>
							<p>
								Date: ${ formatDate( run.date ) }<br />
								Duration: ${ formatNumber( run.duration ) } min<br />
								Distance: ${ formatNumber( run.distance ) }mi<br />
								Pace: ${ formatNumber( calculatePace( run ) ) }<br />
							</p>
						</div>
						<div class="run-card-aside small">
							<button class="deleteRunButton" data-id="${ run.id }">
								Delete
							</button>
							<br />
							<button class="editRunButton" data-id="${ run.id }">
								Edit
							</button>
						</div>
					</div>
				`
			}
		);
	}
	runListElement.innerHTML = html;
	const deleteButtons = document.querySelectorAll('.deleteRunButton')
	deleteButtons.forEach(
		button => {
			button.addEventListener(
				'click', function () {
					const id = button.dataset.id;
					const targetRun = getRunById( id );
					if( !(confirm( `Are you sure you want to delete ${ targetRun.title } ?`) )){
						return;
					}
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
	loadSetting({
		control: filterRunsSelect,
		settingName: 'filterProperty'
	});
	loadSetting({
		control: sortRunsSelect,
		settingName: 'sortProperty'
	});
	renderRuns({ filterProperty: filterRunsSelect.value, sortProperty: sortRunsSelect.value });
	renderTotals();
}
function getFilteredRuns( filterValue ) {
	switch(filterValue) {
		case 'long':
			return getLongRuns();
		case 'thisYear':
			return getRunsThisYear();
		case 'thisMonth':
			return getRunsThisMonth();
		default:
			return runs;
	}
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
		const date = new Date( values.date );
		addRun({
			id: values.id,
			title: values.title,
			date: new Date( date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() ),
			distance: parseFloat(values.distance),
			duration: parseFloat(values.duration)
		});
		form.reset();
		renderApp();
	}
);

const filterRunsSelect = document.querySelector('#filter-runs');
const sortRunsSelect = document.querySelector('#sort-runs');
const applyRenderOptionsButton = document.querySelector('#apply-render-options');
applyRenderOptionsButton.addEventListener(
	'click',
	function(){
		renderRuns( { filterProperty: filterRunsSelect.value, sortProperty: sortRunsSelect.value } );
		saveSetting({ 
			settingName: 'filterProperty',
			settingValue: filterRunsSelect.value 
		});
		saveSetting({
			settingName: 'sortProperty',
			settingValue: sortRunsSelect.value
		});
	}
);

const clearAllRunsButton = document.querySelector( '#clear-all-runs' );
clearAllRunsButton.addEventListener(
	'click',
	function(){
		if( confirm( 'Clear all runs?' ) ){
			clearAllRuns();
		}
		else{
			return;
		}
	}
);

appInit();
