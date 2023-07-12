import fetch from 'node-fetch';
import sharp from 'sharp';

export const handler = async(event) => {


	console.log("********* EVENT ********");
	console.log(event);

	let records = event["Records"][0];
	let request = records["cf"]["request"];
	console.log(request);

	//let url = request["uri"];
	let url = request["uri"];
	console.log("path: " + url);

	//let host = request["headers"]["host"][0];
	//let domain = host["value"]  ;
	let domain = 'http://orig-img-gce.tistatic.com'

	let orig_path = domain + url;
	console.log("requested path: " + orig_path);

	let width = null;
	let height = null;

	if(orig_path.match(/\-w(\d+)\./)) {
	    let mat = orig_path.match(/\-w(\d+)\./);
	    width = parseInt(mat[1]);	
	}else if(orig_path.match(/\-w(\d+)\-h(\d+)\./)) {
	    let mat = orig_path.match(/\-w(\d+)\-h(\d+)\./);
	    width = parseInt(mat[1]);	
	    height = parseInt(mat[1]);	
	}

        const path = orig_path.replace(/-w\d+|-h\d+/g, "");	
	console.log("orig path: " + path);

	const response = await fetch(path);
	const imageBuffer = await response.arrayBuffer(); 

	if (!width && !height){
		const origBuffer = await sharp(imageBuffer).toBuffer();
		return {
			statusCode: 200,
			headers: { 'Content-Type': response.headers.get('Content-Type') },
			body: origBuffer.toString('base64'),
			isBase64Encoded: true,
		};

	}


	const resizedImageBuffer = await sharp(imageBuffer).resize(width, height).toBuffer();

	return {
		statusCode: 200,
		headers: { 'Content-Type': response.headers.get('Content-Type') },
		body: resizedImageBuffer.toString('base64'),
		isBase64Encoded: true,
	};

};

//console.log(await handler({}));
