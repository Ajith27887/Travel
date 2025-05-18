const errorhandler = async(err,req,res,next) => {
	res.status(200).json({ msg: err.message });
}

export default errorhandler;