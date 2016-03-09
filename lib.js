/* Vector Library */
/*
	Works with n-dimensional vectors: represented as arrays of numbers
*/
var V = {};
V.Subtract = function(inV1, inV2)
{
	var out = [];
	for(var i=0; i<inV1.length; i++)
	{
		out[i] = inV1[i] - inV2[i];
	}
	return out;
};
V.Add = function(inV1, inV2)
{
	var out = [];
	for(var i=0; i<inV1.length; i++)
	{
		out[i] = inV1[i] + inV2[i];
	}
	return out;
};
V.Distance = function(inV1, inV2)
{
	return V.Length(V.Subtract(inV1, inV2))
};
V.Dot = function(inV1, inV2)
{
	var out = 0;
	for(var i=0; i<inV1.length; i++)
	{
		out += inV1[i] * inV2[i];
	}
	return out;
};
V.Multiply = function(inV1, inV2)
{
	var out = [];
	for(var i=0; i<inV1.length; i++)
	{
		out[i] = inV1[i] * inV2[i];
	}
	return out;
};
V.Length = function(inV1)
{
	return Math.sqrt(V.Dot(inV1, inV1));
};
V.Scale = function(inV1, inScalar)
{
	var out = [];
	for(var i=0; i<inV1.length; i++)
	{
		out[i] = inV1[i] * inScalar;
	}
	return out;
};
V.Normalize = function(inV1)
{
    return V.Scale(inV1, 1/V.Length(inV1));
};
V.Clone = function(inV1)
{
	var out = [];
	var i;
	for(i=0; i<inV1.length; i++)
	{
		out[i] = inV1[i];
	}
	return out;
};











var M = {};

/**************************
M A T R I X
*/
// transform inC with inM
// returns the transformed inC
M.Transform = function(inM, inC)
{
	var outM = [];
	var outV = [];
	var i, j;
	
	for(i=0; i<inC.length; i++)
	{
		outV = [];
		for(j=0; j<inM.length; j++)
		{
			outV[j] = V.Dot(inM[j], inC[i]);
		}
		outM.push(outV);
	}
	return outM;
};


// flip rows for columns in inM
// returns the modified Matrix
M.Transpose = function(inM)
{
	var dimensions = inM[0].length;
	var i, j;
	var outM = [];
	var outV = [];
	for(i=0; i<dimensions; i++)
	{
		outV = [];
		for(j=0; j<inM.length; j++)
		{
			//the Ith componenth of the Jth member
			outV[j] = inM[j][i];
		}
		outM.push(outV);
	}
	return outM;
}

// returns a matrix that is the result of the outer product of inV1 and inV2
M.Outer = function(inV1, inV2)
{
	var outM = [];
	
	var i;
	for(i=0; i<inV1.length; i++)
	{
		outM.push(V.Scale(inV2, inV1[i]));
	}
	
	return outM;
};





/**************************
B A T C H
*/
//smash the members of inM with a softmax
M.Sigmoid = function(inM)
{
	var i, j;
	var outM = [];
	var outV = [];
	for(i=0; i<inM.length; i++)
	{
		outV = [];
		for(j=0; j<inM[i].length; j++)
		{
			outV[j] = 1/(1 + Math.pow(Math.E, -inM[i][j]));
		}
		outM.push(outV);
	}
	return outM;
};
// return the derivatives of the members of inM (that have been run through the softmax)
M.Derivative = function(inM)
{
	var i, j;
	var component;
	var outM = [];
	var outV = [];
	for(i=0; i<inM.length; i++)
	{
		outV = [];
		for(j=0; j<inM[i].length; j++)
		{
			component = inM[i][j];
			outV[j] = component*(1 - component);
		}
		outM.push(outV);
	}
	return outM;
};


// assuming inM and inCloud are the same length, and that their members have the same dimension,
// return a new matrix whose members are the respective rows of inCloud and inM multiplied.
M.Multiply = function(inM, inCloud)
{
	var i;
	var outM = [];
	for(i=0; i<inM.length; i++)
	{
		outM.push(V.Multiply(inM[i], inCloud[i]));
	};
	return outM;
};


/**************************
B O U N D S
*/
// return the bounding box of inM as a two-member Matrix
M.Bounds = function(inM)
{
	var dimensions = inM[0].length;
	var i, j;
	var min = [];
	var max = [];
	for(i=0; i<dimensions; i++)
	{
		min[i] = 9999999;
		max[i] = -999999;
	}
	for(i=0; i<inM.length; i++)
	{
		for(j=0; j<dimensions; j++)
		{
			if(inM[i][j] < min[j])
			{
				min[j] = inM[i][j];
			}
			if(inM[i][j] > max[j])
			{
				max[j] = inM[i][j];
			}			
		}
	}
	return [min, max];
};

// find the local coordinates for all the members of inM, within the bounding box inB
// returns a new Matrix of relative vectors
M.GlobalToLocal = function(inM, inB)
{
	var dimensions = inB[0].length;
	var i, j;
	var outM = [];
	var outV = [];
	var size;
	var min;
	for(i=0; i<inM.length; i++)
	{
		outV = [];
		for(j=0; j<dimensions; j++)
		{
			outV[j] = (inM[i][j] - inB[0][j])/(inB[1][j] - inB[0][j]);
		}
		outM.push(outV);
	}
	return outM;
};
// find the global coordinates for all the members of inM, within the bounding box inB
// returns a new Matrix of global vectors
M.LocalToGlobal = function(inM, inB)
{
	var dimensions = inB[0].length;
	var i, j;
	var outM = [];
	var outV = [];
	var size;
	var min;
	for(i=0; i<inM.length; i++)
	{
		outV = [];
		for(j=0; j<dimensions; j++)
		{
			outV[j] = inB[0][j] + inM[i][j] * (inB[1][j] - inB[0][j]);
		}
		outM.push(outV);
	}
	return outM;
};


/**************************
C L O U D
*/
// return some number of points from inM as a new Matrix
M.Reduce = function(inM, inCount)
{
	var largeGroupSize;
	var largeGroupCount;
	var smallGroupSize;
	var outM = [];
	
	largeGroupSize = Math.floor(inM.length/inM);
	smallGroupSize = inM.length%inCount
	for(i=0; i<inM-1; i++)
	{
		index = i*largeGroupSize + Math.floor(Math.random()*largeGroupSize);
		outM.push( V.Clone(inM[index]) );
	}
	if(smallGroupSize != 0)
	{
		index = i*largeGroupSize + Math.floor(Math.random()*smallGroupSize)
		outM.push( V.Clone(inM[index]) );
	}
	return outM;
};

// return a Matrix of length inCount, where all the members fall within the circle paramemters, including a bias
M.Circle = function(inCenter, inRadius, inBias, inCount)
{
	var i, j;
	var vector;
	var length;
	var outM = [];
	
	for(i=0; i<inCount; i++)
	{
		//generate a random vector
		vector = [];
		for(j=0; j<inCenter.length; j++)
		{
			vector[j] = (Math.random() - 0.5);
		}
		
		//normalize the vector
		vector = V.Scale(vector, 1/V.Length(vector));
		
		//set a random length (with a bias)
		length = Math.pow(Math.random(), Math.log(inBias)/Math.log(0.5))*inRadius;
		vector = V.Scale(vector, length);
		
		//move the vector to the center
		vector = V.Add(vector, inCenter);
		
		outM.push(vector);
	}
	return outM;
};

// return a Matrix of length inCount, where all the members fall within inBounds
M.Box = function(inBounds, inCount)
{
	var vector;
	var dimensions = inBounds[0].length;
	var i, j;
	var min, max;
	var outM = [];
	
	for(i=0; i<inCount; i++)
	{
		vector = [];
		for(j=0; j<dimensions; j++)
		{
			min = inBounds[0][j];
			max = inBounds[1][j];
			
			vector[j] = min + Math.random()*(max - min);
		}
		outM.push(vector);
	}
	return outM;
};

//combine all the matricies in inList into one long Matrix
M.Combine = function(inList)
{
	var i, j;
	var outM = [];
	for(i=0; i<inList.length; i++)
	{
		for(j=0; j<inList[i].length; j++)
		{
			outM.push(V.Clone(inList[i][j]));
		}
	}
	return outM;
};

// add a new column full of 1's
M.Pad = function(inM)
{
	var outM = [];
	
	var i;
	for(i=0; i<inM.length; i++)
	{
		outM.push(V.Clone(inM[i]).push(1));
	}
	
	return outM;
};












