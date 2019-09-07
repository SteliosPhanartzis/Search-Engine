const request = require('request');
const cheerio = require('cheerio');

request('https://www.youtube.com/watch?v=LoziivfAAjE', (error, res, html) => {
	if(!error && res.statusCode == 200){
		const $ = cheerio.load(html);

		//Headings
		$('h1').each((i, hd1) => {
			const itm = $(hd1).text();
			console.log(itm);
		});
		$('a').each((i, el) => {
			const itm = $(el).text();
			const link = $(el).attr('href');
			console.log(link);

		});
	}
});

