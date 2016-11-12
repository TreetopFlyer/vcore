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
// where the Nth member of outM is a copy of V1, scaled by the Nth component of V2
M.Outer = function(inV1, inV2)
{
	var outM = [];
	
	var i;
	for(i=0; i<inV2.length; i++)
	{
		outM.push(V.Scale(inV1, inV2[i]));
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
// batch multiply these pairs of vectors
M.Multiply = function(inCloud1, inCloud2)
{
	var i;
	var outM = [];
	for(i=0; i<inCloud1.length; i++)
	{
		outM.push(V.Multiply(inCloud1[i], inCloud2[i]));
	};
	return outM;
};
// batch add
M.Add = function(inCloud1, inCloud2)
{
    var outM = [];
    
    var i;
    for(i=0; i<inCloud1.length; i++)
    {
        outM.push(V.Add(inCloud1[i], inCloud2[i]));
    }
    return outM;
};
M.Subtract = function(inCloud1, inCloud2)
{
    var outM = [];
    
    var i;
    for(i=0; i<inCloud1.length; i++)
    {
        outM.push(V.Subtract(inCloud1[i], inCloud2[i]));
    }
    return outM;
};
M.Scale = function(inCloud1, inScalar)
{
    var outM = [];
    
    var i;
    for(i=0; i<inCloud1.length; i++)
    {
        outM.push(V.Scale(inCloud1[i], inScalar));
    }
    return outM;
};
M.Clone = function(inM)
{
    var i;
    var outM;
    var outV;
    
    outM =[];
    for(i=0; i<inM.length; i++)
    {
        outM.push(V.Clone(inM[i]));
    }
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
	var denominator;
	for(i=0; i<inM.length; i++)
	{
		outV = [];
		for(j=0; j<dimensions; j++)
		{
			denominator = inB[1][j] - inB[0][j];
			if(denominator == 0)
			{
				outV[j] = inB[1][j];// if min and max are the same, just output max
			}
			else
			{
				outV[j] = (inM[i][j] - inB[0][j])/denominator]);	
			}
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

/*
PLEASE NOTE: These padding routines are unique to this library in that they
actually modify the input object(s) rather than returning modified copies!
*/
// add a new component (set to '1') to each member of inM
M.Pad = function(inM)
{
	var i;
	for(i=0; i<inM.length; i++)
	{
		inM[i].push(1);
	}
    	return inM;
};
// remove the last component of each memeber of inM
M.Unpad = function(inM)
{
	var i;
    	for(i=0; i<inM.length; i++)
	{
        	inM[i].pop();
	}
	return inM;
};
// set the last component of each member of inM to 1
M.Repad = function(inM)
{
	var i;
	var last = inM[0].length-1;
    	for(i=0; i<inM.length; i++)
	{
        	inM[i][last] = 1;
	}
	return inM;
};
