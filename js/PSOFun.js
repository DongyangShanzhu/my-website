function min(data){
	//correct
	var i=0;
	for(var j=1;j<data.length;j++)
		if(data[j]<data[i])
			i=j;
	return{num:data[i],index:i};
}

function max(data){
	//correct
	var i=0;
	for(j=1;j<data.length;j++)
		if(data[j]>data[i])
			i=j;
	return{num:data[i],index:i};
}

function matrixMul(a,b){
	var c=new Array(a.length);
	for(var i=0;i<a.length;i++)
	{
		c[i]=new Array(b[0].length);
		for(var j=0;j<b[0].length;j++)
		{
			c[i][j]=0;
			for(var k=0;k<b.length;k++)
			{
				c[i][j]+=a[i][k]*b[k][j];
			}
		}
	}
	return c;
}

function sort(data,n){
    var i,j;
    var Index=new Array(n);
    for(i=0;i<n;i++)
    	Index[i]=i;
    for(i=0;i<n-1;i++){
		for(j=i+1;j<n;j++){
			if(data[i]>data[j]){
				var tmp=data[i];data[i]=data[j];data[j]=tmp;
				tmp=Index[i];Index[i]=Index[j];Index[j]=tmp;
			}
		}
    }
	return{num:data,index:Index};
}

function decode(particle,n,m,positionx,positiony,ca_wei,co_ne){
	//正确
	var i,j;
	//生成客户服务顺序向量seq
	var seq=sort(particle,n).index;
	var co_ca_mat = new Array(n);//zeros(n,m);
	var c_c_dis = new Array(n);//zeros(n,m);
	var ca_weied = new Array(m);//zeros(m,1);
	var ca_co_num = new Array(m);//ones(m,1);
	var ca_co = new Array(m);//zeros(m,n);
	for (i=0;i<m;i++){
		ca_co[i]=new Array();
		ca_co_num[i]=0;
		ca_weied[i]=0;
	}
	//计算客户到车辆的距离
	for(i=0;i<n;i++){
	    //生成车辆相对坐标
		co_ca_mat[i]=new Array(m);
		c_c_dis[i]=new Array(m);
	    for(j=0;j<m;j++){
	        c_c_dis[i][j]=Math.pow((positionx[i+1]-particle[n+j]),2)+Math.pow((positiony[i+1]-particle[n+j+m]),2);
	    }
	}
	//确定客户-车辆矩阵
	for(i=0;i<n;i++)
		co_ca_mat[i]= sort(c_c_dis[i],c_c_dis[i].length).index;

	//确定车辆服务的客户
	for(i=0;i<n;i++)
	    for(j= 0;j<m;j++){
	    	var tmp=ca_weied[co_ca_mat[seq[i]][j]]+co_ne[seq[i]];
	        if(tmp<ca_wei[co_ca_mat[seq[i]][j]]){
	            ca_co[co_ca_mat[seq[i]][j]].push(seq[i]);
                ca_weied[co_ca_mat[seq[i]][j]] =tmp;
                ca_co_num[co_ca_mat[seq[i]][j]]++;
	            break;
	        }

	    }
	return ca_co;
}

function t_opt(pathway,Dis){
	//解码pathway
	var i,j,n,len,pathlen,newpathway,left,right,tmp,ii,jj;
	var ind=pathway.length;
	var maxcount = 50; //最大尝试次数
	len=pathway.length;
	for(i=0;i<len;i++)
		pathway[i]++;
	if(len>=2){
		n = 0;
		pathlen = Dis[0][pathway[0]]+Dis[pathway[len-1]][0];
		for(i=0;i<len-1;i++)
		    pathlen += Dis[pathway[i]][pathway[i+1]];
		newpathway = pathway;
		//进行交换，直至最优解
		while(n < maxcount){
		    var order=new Array(len);
		    for(ii=0;ii<len;ii++)
		    	order[i]=Math.random();
		    order=sort(order,len).index;
		    left = order[0];
		    right = order[1];
		    if(left>right){
		       tmp = left;
		       left =right;
		       right = tmp;
		    }
		    while(left < right){
		        tmp = newpathway[left];
		        newpathway[left] = newpathway[right];
		        newpathway[right] = tmp;
		        left ++;
		        right --;
		    }
		    //计算交换后路径长度
		    newpathlen = Dis[0][newpathway[0]]+Dis[newpathway[len-1]][0];
		    for(i=0;i<len-1;i++)
		        newpathlen += Dis[newpathway[i]][newpathway[i+1]];

		    if(newpathlen >= pathlen){
		        n++;
		        newpathway = pathway;
		    }
		    else{
		        n = 0;
		        pathway = newpathway;
		        pathlen = newpathlen;
		    }
		}
	}
	else if(len==1){
		//单点往返路程
		pathlen= Dis[0][pathway[0]]+Dis[pathway[0]][0];
	}
	else pathlen=0;
	return {Pathway:pathway,Pathlen:pathlen};
}
	
function fitvalue(particle,n,m,positionx,positiony,ca_wei,co_ne,Dis){
	//error
	var ca_co = decode(particle,n,m,positionx,positiony,ca_wei,co_ne);//粒子解码
	var rou_len = new Array(m);//zeros(m,1)每辆车走过距离向量
	var length=0;
	var res=new Array(m);
    for(i=0;i<m;i++){
	    //求解第i辆车路径长度
	    var tmpRes = t_opt(ca_co[i],Dis);//2-opt求解第i辆车最优路径
	    res[i]=tmpRes.Pathway;
	    length+=tmpRes.Pathlen;
    }
    return {Route:res,Length:length};
}

function PSO(Dis,positionx,positiony,lo,need)
{
    var i,j,k,t,d,m=1;
    //positionx,positiony:客户位置(
    // D=n+2m; n=货物数量 ; m=配送车趟数
    var n=positionx.length;
    n=n-1;//排除第一个配送原点
    var D=n+2*m;//维数

    //对positionx和positiony需要进行预处理
    for(i=1;i<positionx.length;i++){
    	positionx[i]-=positionx[0];
    	positiony[i]-=positiony[0];
    }
    positionx[0]=0;positiony[0]=0;
    //console.log(positionx);
    //console.log(positiony);


    var Xmax=Math.max(Math.max.apply(Math,positionx),Math.max.apply(Math,positiony));
    var Xmin=Math.max(Math.min.apply(Math,positionx),Math.min.apply(Math,positiony));

    //初始化参数
    var cp=0.5;// 个人最佳位置加速度常数
    var cg=0.5;// 全局最佳位置加速度常数
    var cl=1.5;// 局部最佳位置加速度常数
    var cn=1.5;// 近邻最佳位置加速度常数
    var pc=0.5;// 交叉概率
    var pm=0.5;// 变异概率
    var Cmin=0;
    var c1=2;
    var c2=2;
    var w0=0.9;//初始权重 权重一般设为0.9
    var w1=0.4;//结束权重
    var Rnum=0;//最优解重复次数
    var T=1000; //迭代次数1000
    var I=50; //粒子群的规模50
    var K=2; //临近粒子数 

    //用于记录配送路线
    var route=new Array(I);
    var bestroute;//用于记录配送路线

    //预设参数
    var W= new Array(T);//第t次迭代的惯性权值
    var fitnessbest=new Array(T);//历代最优解
    var fit=new Array(I);//适应度
    //分布粒子的取值范围及速度的取值范围
    var X=new Array(I);//Xmin+(Xmax-Xmin)*rand(I,D); %在区间[Xmin,Xmax]内取值
    var V=new Array(I);// %v在[-Xmin/4,Xmax/4]中取值
    //var v= new Array(I);//第t次迭代中第i个粒子在第d维的速度zeros(I,D,T+1)
    //var x= new Array(I);//第t次迭代中第i个粒子在第d维的位置zeros(I,D,T+1);

    //4个best
    var gbest;//第d维的全局最佳位置(gbest)zeros(1,D); 
    var pbest;//第i个粒子在第d维的个人最佳位置(pbest)zeros(I,D);
    var lbest=new Array(I);//标识第i个粒子在第d维的局部最佳位置(lbest)zeros(I,D);%
    var nbest=new Array(I);//第i个粒子在第d维的近邻最佳位置(nbest)zeros(I,D);%
    var FDR=new Array(D);//适应度距离比值zeros(D,I);%

    //计算所需配送趟数
    var sumNeed=0;
    var error = 1;
    var load = [lo];
    for(i=0;i<need.length;i++)
        sumNeed+=need[i];
    if(sumNeed>lo){
        while(m*load<sumNeed){
            m++;
            load.push(lo);
        }
        //判断解码时是否会出现丢失客户情况
        while(error ==1){
            error = 0;
            for(i=0;i<1000;i++){
                var t=new Array(D);
                for(d=0;d<D;d++)
                    t[d]=Xmin+(Xmax-Xmin)*Math.random();
                ca_co = decode(t,n,m,positionx,positiony,load,need);
                var number_of_customer = 0;
                for(d=0;d<ca_co.length;d++)
                    number_of_customer+=ca_co[d].length;
                if(number_of_customer!=n)
                    error = 1;
            }
            if(error ==1){
                m++;
                load.push(lo);
            }
        }
    }
    //计算适应度，对数据初始化
    for(i=0;i<I;i++){
        //解码,计算总路程s 
        X[i]=new Array(D);
        V[i]=new Array(D);
        lbest[i]=new Array(D);
        nbest[i]=new Array(D);
        for(j=0;j<D;j++)
        {
            X[i][j]=Xmin+(Xmax-Xmin)*Math.random();
            V[i][j]=-(Xmax-Xmin)*0.25+(Xmax-Xmin)*0.5*Math.random();
        }
        var tmp=fitvalue(X[i],n,m,positionx,positiony,load,need,Dis);
        fit[i]=tmp.Length;
        route[i]=tmp.Route;
    }




    var pbest_value = fit;//每个粒子的最优适应度值
    pbest=X;
    var res=min(fit);
    var gbest_value=res.num;//全局最优适应度
    var ind=res.index;
    gbest=X[ind];
    bestroute=route[ind];
    for(t=0;t<T;t++){
        for(i=0;i<I;i++){
            //更新
            //1.pbest
            if(fit[i]<pbest_value[i]){
                pbest[i]=X[i];
                pbest_value[i] = fit[i];
            }
            
            //2.gbest
            if (fit[i]<gbest_value){
                gbest=pbest[i];
                gbest_value = fit[i];
                bestroute=route[i];
            }
        }
        fitnessbest[t] = gbest_value;
        for(i=0;i<I;i++){
            //3.lbest
            var tmpFit=new Array();
            var tmpX =new Array();
            var sign=0;
            for(j=i-K;j<=i+K;j++,sign++){
                if(j<0){
                    tmpFit[sign]=fit[j+I];
	                tmpX[sign]=pbest[j+I];
                }
                else if(j>=I){
                    tmpFit[sign]=fit[j-I];
	                tmpX[sign]=pbest[j-I];
                }
                else{
	                tmpFit[sign]=fit[j];
	                tmpX[sign]=pbest[j];
                }
            }
            var ind=min(tmpFit).index;
            lbest[i]=tmpX[ind];
            //4.nbest
            for(d=0;d<D;d++){
            	FDR[d]=new Array(I);
                for(j=0;j<I;j++)
                    if(j!=i)
                        FDR[d][j]=(fit[i]-pbest_value[j])/Math.abs(X[i][d]-pbest[j][d]);
                    else
                        FDR[d][j]=-1.7976931348623157E+10308;//负无穷
            }
            for(d=0;d<D;d++){
                ind=max(FDR[d]).index;
                nbest[i][d] = pbest[ind][d];
            }
            //W
            W[t]=w1+(t-T)/(1-T)*(w0-w1);
            //V & X
            var randi = Math.random();
            for (d=0;d<D;d++){
                V[i][d]=W[t]*V[i][d]+cp*randi*(pbest[i][d]-X[i][d])+cg*randi*(gbest[d]-X[i][d])+
                cl*randi*(lbest[i][d]-X[i][d])+cn*randi*(nbest[i][d]-X[i][d]);
                X[i][d]+=V[i][d];                
                if(X[i][d]>Xmax){
                    X[i][d]=Xmax-0.1*Math.random();
                    V[i][d]=0;
                }
                else if(X[i][d]<Xmin){
                    X[i][d]=Xmin+0.1*Math.random();
                    V[i][d]=0;
                }
            }
        }
        //是否跳出循环
        if(t>0){
            if(fitnessbest[t]-fitnessbest[t-1]==0)
                Rnum++;
            else Rnum=0;
        }
        //超过100代添加交叉变异过程
        if(Rnum>100){
            for(i=0;i<I;i++){
                //交叉
                if((i%2==0)&&(Math.random()<pc)&&(i<I-1))
                {
                    var cpoint=Math.round(Math.random()*D);
                    var tmp1=X[i];
                    var tmp2=X[i+1];
                    for(d=cpoint;d<D;d++){
                        X[i][d]=tmp2[d];
                        X[i+1][d]=tmp1[d];
                    }
                }
                //变异
                var r=Math.random();
                if(r<pm){
                    var mpoint=Math.ceil(r*D);//向上取整，获得变异位置
                    X[i][mpoint]=Xmin+(Xmax-Xmin)*Math.random();
                }
            }
        }
        //解码,计算总路程
        //重新计算适应度
        for (i=0;i<I;i++){
	        var tmp=fitvalue(X[i],n,m,positionx,positiony,load,need,Dis);
	        fit[i]=tmp.Length;
	        route[i]=tmp.Route;
        }
    }
    var r=min(fitnessbest).num;
    return{bestDistance:r,bestRoute:bestroute};
}
