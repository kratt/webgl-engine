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


vec4 v_Color;


float Hue_2_RGB(float v1, float v2, float vH )
{
	float ret;
	if ( vH < 0.0 ) vH += 1.0;
	if ( vH > 1.0 ) vH -= 1.0;
	if ( ( 6.0 * vH ) < 1.0 )
		ret = ( v1 + ( v2 - v1 ) * 6.0 * vH );
	else if ( ( 2.0 * vH ) < 1.0 )
		ret = ( v2 );
	else if ( ( 3.0 * vH ) < 2.0 )
		ret = ( v1 + ( v2 - v1 ) * ( ( 2.0 / 3.0 ) - vH ) * 6.0 );
	else
		ret = v1;
	return ret;
}

vec3 getRgb( float H, float L, float S)
{
	float var_2, var_1;
	if (S == 0.0)
	{
		return vec3(L,L,L);
	}else{
		if ( L < 0.5 )
		{
			var_2 = L * ( 1.0 + S );
		}else{
			var_2 = ( L + S ) - ( S * L );
		}

		var_1 = 2.0 * L - var_2;

		return vec3( 	Hue_2_RGB( var_1, var_2, H + ( 1.0 / 3.0 ) ),
						Hue_2_RGB( var_1, var_2, H ),
						Hue_2_RGB( var_1, var_2, H - ( 1.0 / 3.0 ) )   );
	}
}


void main()
{
	float x_min = minRe;
	float x_max = maxRe;
	
	float y_min = minIm;
	float y_max = maxIm;
	
	float cx = ( ( gl_FragCoord.x / windowWidth)  * (x_max - x_min) + x_min);// * scaleX;
    float cy = ( ( gl_FragCoord.y / windowHeight) * (y_max - y_min) + y_min);//* scaleY;// * scaleY;

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

	v_Color = vec4(0.0, 0.0, 0.0, 1.0);
	
	if(isInside)
	{	
		gl_FragColor = vec4( vec3(0.0,0,0) , v_Color.a);	
	}
	else
	{		
		float modulus = sqrt (Z_re*Z_re + Z_im*Z_im);
		float mu = float(numIter) - (log(log(modulus)))/ log(2.0);
		
		float smoothcolor = float(numIter) / float(maxIter);
		
		gl_FragColor = vec4(smoothcolor); // vec4(getRgb(smoothcolor*smoothcolor, 0.3, 1.0), v_Color.a);


		float angle = 2.0* 3.14 * float(mu) / float(maxIter) ;
		gl_FragColor = vec4(1.0 - (0.5+0.5*cos(angle*1.0)),
							1.0 - (0.5+0.5*cos(angle*5.0)),
							1.0 - (0.5+0.5*sin(angle*15.0)), 
							1.);
   
	    float R = 10.0;
		float G = 110.0;
		float B = 1.0;

		float co = float( numIter);// + 1.0 - log2(0.5*log2(modulus));
		co = sqrt(co/125.0);

		//gl_FragColor = vec4(0.5+0.5*cos(6.2831*co+R), 0.5+0.5*cos(6.2831*co + G), 0.5+0.5*cos(6.2831*co +B), 1.0 );
		gl_FragColor = vec4(vec3(1.0-co), 1.0 );
	}

}









