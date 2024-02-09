import os from 'os';

const operatingSystem = (arg) => {
	switch (arg) {
		case '--EOL':
			const eol = os.EOL;
			console.log(`End-of-line: ${JSON.stringify(eol)}`);
			break;

		case '--cpus':
			const cpus = os.cpus();
			console.log('CPUs info:');
			cpus.forEach((cpu, index) => {
				const model = cpu.model;
				const speed = cpu.speed / 1000;
				console.log(`CPU ${index + 1}: ${model} (${speed} GHz)`);
			});
			break;

		case '--homedir':
			const homedir = os.homedir();
			console.log(`Home directory: ${homedir}`);
			break;

		case '--username':
			const username = os.userInfo().username;
			console.log(`Username: ${username}`);
			break;

		case '--architecture':
			const architecture = process.arch;
			console.log(`Architecture: ${architecture}`);
			break;

		default:
			console.log(`Invalid input. Invalid argument ${arg}`);
	}
}

export { operatingSystem };