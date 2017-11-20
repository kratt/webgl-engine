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
	
	float cx = ( ( gl_FragCoord.x / windowWidth)  * (x_max - x_min) + x_min) * scaleX;
    float cy = ( ( gl_FragCoord.y / windowHeight) * (y_max - y_min) + y_min) * scaleY;

	float c_im = cy;
	float c_re = cx;
		
	float Z_re = c_re;
	float Z_im = c_im;
	bool isInside = true;
	int numIter;
	
	const int maxIter = 1000;
	float esc_radius = 4.0;
	
	for( int n=0; n < maxIter ; ++n)
	{
		float Z_re2 = Z_re * Z_re;
		float Z_im2 = Z_im*Z_im;
		if(Z_re2 + Z_im2 > esc_radius)
		{
			isInside = false;
			break;
		}
		Z_im = 2.0*Z_re*Z_im + c_im;
		Z_re = Z_re2 - Z_im2 + c_re;
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
		float modulus = sqrt (Z_re*Z_re + Z_im*Z_im);
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









