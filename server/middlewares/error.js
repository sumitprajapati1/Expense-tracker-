export default async (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(err.errors).map(val => val.message)
      });
    }
  
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Resource not found'
      });
    }
  
    // Default to 500 server error
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  };
  
  