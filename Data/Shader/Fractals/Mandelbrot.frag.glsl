precision highp float;

varying vec4 vPosition; 
varying vec4 vNormal; 
varying vec4 vColor; 
varying vec4 vTexture;

uniform float windowWidth;
uniform float windowHeight;

uniform float minRe;
uniform float maxRe;
uniform float minIm;
uniform float maxIm;

uniform float scaleX;
uniform float scaleY;

uniform int coloring;




void main()
{
	float x_min = minRe;
	float x_max = maxRe;
	
	float y_min = minIm;
	float y_max = maxIm;
	
	// starting point (cx, cy) in complex plane
	float cx = ( ( gl_FragCoord.x / windowWidth)  * (x_max - x_min) + x_min) * scaleX;
    float cy = ( ( gl_FragCoord.y / windowHeight) * (y_max - y_min) + y_min) * scaleY;

	float zx = cx;
	float zy = cy;

	bool isInside = true;
	int numIter = 0;
	
	const int maxIter = 1000;
	float esc_radius = 4.0;
	
	
	for( int n=0; n < maxIter ; ++n)
	{
        if((zx * zx + zy * zy) > 4.0) 
		{
			isInside = false;
			break;
		}
		
		float x = (zx * zx - zy * zy) + cx;
        float y = (zy * zx + zx * zy) + cy;
		
        zx = x;
        zy = y;
		
		numIter=n;
	}
	

	numIter++;
	
	if(isInside)
	{	
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);	
	}
	else
	{		
		// coloring taken and adpated from https://github.com/Syntopia/Fragmentarium
		float modulus = sqrt (zx*zx + zy*zy);
		float mu = float(numIter) - (log(log(modulus)))/ log(2.0);
				
	    float R = 0.0;
		float G = 0.0;
		float B = 0.0;
		
		if(coloring == 0) // grey
		{
			 R = 200.0;
			 G = 200.0;
			 B = 200.0;
		}
		else if(coloring == 1){
			 R = 10.0;
			 G = 110.0;
			 B = 1.0;	
		}
		else if(coloring == 2)
		{
			 R = 0.0;
			 G = 0.0;
			 B = 200.0;	
		}

		float co = float(numIter) + 1.0 - log2(0.5*log2(modulus));
		co = sqrt(co/125.0);

		gl_FragColor = vec4(0.5+0.5*cos(6.2831*co+R), 0.5+0.5*cos(6.2831*co + G), 0.5+0.5*cos(6.2831*co +B), 1.0 );
	}
	
}









