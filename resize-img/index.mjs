import AWS from 'aws-sdk';
import sharp from 'sharp';
import fetch from 'node-fetch';

export const handler = async(event) => {


	//let path = 'https://tiimg.tistatic.com/new_website1/micro_cate_images/2/b/72/31372-w124.jpg';
	console.log(event);
	let url = event["rawPath"];
	let path = 'https://tiimg.tistatic.com' + url;

	let width = null;
	let height = null;

	if(path.match(/\-w(\d+)\./)) {
	    let mat = path.match(/\-w(\d+)\./);
	    width = parseInt(mat[1]);	
	}else if(path.match(/\-w(\d+)\-h(\d+)\./)) {
	    let mat = path.match(/\-w(\d+)\-h(\d+)\./);
	    width = parseInt(mat[1]);	
	    height = parseInt(mat[1]);	
	}

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
