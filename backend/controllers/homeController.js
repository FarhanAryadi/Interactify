const home = async (req, res, next) => {
	return res.status(200).json({
		title: 'Express home',
		message: 'The api is working',
	});
};

export { home };
