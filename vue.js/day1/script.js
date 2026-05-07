const runs = [
	{
		id: 'c162e6e5-6288-4444-b5da-c7ae562ca0f5',
		date: new Date(2026, 4, 1),
		distance: 5,
		duration: 30
	},
	{
		id: '9e2fba33-3027-4a62-88ed-29158a641f87',
		date: new Date(2026, 4, 2),
		distance: 10,
		duration: 48
	},
	{
		id: '235431db-3988-4c57-a3cf-b619dfe2db3c',
		date: new Date(2025, 5, 1),
		distance: 7,
		duration: 28
	},
	{
		id: '5a9c01d0-5b75-4226-a3b0-091a45e7d2f4',
		date: new Date(2026, 3, 3),
		distance: 6,
		duration: 12
	}
];

function addRun(date, distance, duration) {
	const newRun = {
		id: crypto.randomUUID(),
		date: date,
		distance: distance,
		duration: duration
	};

	runs.push(newRun);
}
function getTotals() {
	const result = {
		totalCount: runs.length,
		totalDistance: runs.reduce((sum, run) => { return sum + run.distance }, 0),
		totalDuration: runs.reduce((sum, run) => { return sum + run.duration }, 0)
	};
	return result;
}
function printRuns() {
	runs.forEach(
		run => {
			console.log(`ID: ${run.id}, Date: ${run.date}, Distance: ${run.distance} km, Duration: ${run.duration} minutes`);
		}
	);
}
function calculateAverageDistance() {
	const totals = getTotals()
	return (totals.totalDistance / totals.totalCount);
}
function getLongRuns() {
	return runs.filter(
		run => run.distance > 7
	);
}
function getLongestDurationRun() {
	return runs.reduce(
		(prev, curr) => {
			return (prev.duration > curr.duration) ? prev : curr;
		}
	);
}
function getShortestDurationRun() {
	return runs.reduce(
		(prev, curr) => {
			return (curr.duration > prev.duration) ? prev : curr;
		}
	);
}
function getSlowestPaceRun() {
	return runs.reduce(
		(prev, curr) => {
			return ( calculatePace(prev) > calculatePace(curr) ) ? prev : curr
		}
	);
}
function getFastestPaceRun() {
	return runs.reduce(
		(prev, curr) => {
			return ( calculatePace(curr) > calculatePace(prev) ) ? prev : curr
		}
	);
}
function getRunById(id) {
	return runs.find(run => run.id === id);
}
function removeRunById(id) {
	const index = runs.findIndex( run => run.id === id )
	if( index !== -1){
		runs.splice(index,1);
	}
}
function getRunsThisYear() {
	return runs.filter(
		run => run.date.getFullYear() === (new Date().getFullYear())
	);
}
function getRunsThisMonth() {
	return runs.filter(
		run => run.date.getFullYear() === (new Date().getFullYear())
			&& run.date.getMonth() === (new Date().getMonth())
	);
}
function calculatePace( run ) {
	return run.duration / run.distance;
}

const thisRun = getRunById( '9e2fba33-3027-4a62-88ed-29158a641f87' );
console.log( `Pace: ${ calculatePace( thisRun ) }` );