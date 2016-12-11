var game={
	data:null,//保存RN行，CN列的二维数组
	RN:4,CN:4,
	score:0,
	state:1,
	GAMEOVER:0,
	RUNNING:1,
	//强调：
	//1、每个属性和方法结尾都要用逗号分隔
	//2、方法中使用自己的属性都必须前加this.
	start:function(){
		//重置游戏状态为running
		this.state=this.RUNNING;
		//将score重置为0
		this.score=0;
		//初始化RN*CN的为二维数组，保存到data属性中
		//创建空数组保存在data属性中
		//r从0开始，到<RN结束
			//向data中压入一个空数组
			//c从0开始，到<CN结束
				//向data中r行压入一个0
		//(遍历结束)
		this.data=[];
		for(var r=0;r<this.RN;r++){
			this.data.push([]);
			for(var c=0;c<this.CN;c++){
				this.data[r].push(0);
			}
		}
		this.randomNum();
		this.randomNum();
		this.updateView();
		//debugger;//F12:鼠标放到任意关心的变量或属性
		//console.log(this.data.join("\n"));
		//为document绑定键盘按下事件
			//当键盘按下时自动执行该函数
		document.onkeydown=function(e){
		//事件处理函数中：this -> .前的对象document
		//bind将this->game
			//alert(e.keyCode);
			//判断e.keyCode
				//是37：左移
				//是38：上移
				//是39：右移
				//是40：下移
			switch(e.keyCode){
				case 37:
					this.moveLeft();
					break;
				case 39:
					this.moveRight();
					break;
				case 38:
					this.moveUp();
					break;
				case 40:
					this.moveDown();
					break;
			}
		}.bind(this);
	},
	randomNum:function(){//在一个随机位置生成2或4
		//反复：
		//在0~RN-1之间取一个随机数r
		//在0~CN-1之间取一个随机数c
		//如果data中r行c列为0
			//设置data中r行c列的值为：
				//随机生成一个小数，如果<0.5,就赋值2，否则赋值4
			//退出循环
		while(true){
			var r=Math.floor(Math.random()*this.RN);
			var c=Math.floor(Math.random()*this.CN);
			if(this.data[r][c]==0){
				this.data[r][c]=Math.random()<0.5?2:4;
				break;
			}
		}
	},
	updateView:function(){
		//将data中的每个元素值更新到页面对应的div上
		//遍历data
			//找到和r行c列位置对应的div
			//如果data中当前元素的值不等于0
				//设置其内容为data中当前元素的值
				//设置div的class属性为"cell n+当前元素值"
			//否则
				//清除div的内容
				//设置div的class为"cell"
			for(var r=0;r<this.RN;r++){
				for(var c=0;c<this.CN;c++){
					var div=document.getElementById("c"+r+c);
					if(this.data[r][c]!==0){
						div.innerHTML=this.data[r][c];
						div.className="cell n"+this.data[r][c];
					}else{
						div.innerHTML="";
						div.className="cell";
					}
				}
			}
			//将score属性的值，放入id为score的div中
			document.getElementById("score").innerHTML=this.score;

			//如果游戏结束
				//设置id为gameOver的div显示
			//否则，设置id为gameOver的div隐藏
			//如果游戏结束，就设置id为final的span的内容为score
			document.getElementById("gameOver").style.display=this.state===this.GAMEOVER?"block":"none";
			this.state===this.GAMEOVER&&(document.getElementById("final").innerHTML=this.score);
	},
	moveLeft:function(){//左移所有行
		//为data拍照，保存在before中
		//遍历data中每一行
			//调用moveLeftInRow(r)
		//(遍历结束)
		//为data拍照保存在after中
		//如果before不等于after
			//随机生成一个数
			//更新页面
		var before=String(this.data);
		for(var r=0;r<this.RN;r++){
			this.moveLeftInRow(r);
		}
		var after=String(this.data);
		if(before!=after){
			this.randomNum();
			//如果游戏结束，修改游戏状态为gameover
			if(this.isGAMEOVER()==true){
				this.state=this.GAMEOVER;
			}
			this.updateView();
		}
	},
	isGAMEOVER:function(){
		//遍历data
			//如果当前元素是0或者
				//c<this.CN-1且当前元素等于右侧元素，就返回false或者
				//r<this.RN-1且当前元素等于下方元素，就返回false
		//(遍历结束)
		//返回true，游戏结束
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(this.data[r][c]==0||(c<this.CN-1&&this.data[r][c]==this.data[r][c+1])||(r<this.RN-1&&this.data[r][c]==this.data[r+1][c])){
					return false;
				}
			}
		}
		return true;
	},
	moveLeftInRow:function(r){//左移1行
		//c从0开始，遍历data中r行，到<CN-1结束
			//找data中r行c列右侧下一个不为0的位置nextc
			//如果nextc是-1，就退出循环
			//否则
				//如果r行c列为0，
					//将r行nextc列的值赋值给r行c列
					//将r行nextc列的值置为0
					//c留在原地
				//否则，如果r行c列等于r行nextc列
					//将r行c列的值*2
					//将r行nextc列的值置为0
		for(var c=0;c<this.CN-1;c++){
			var nextc=this.getNextInRow(r,c);
			if(nextc==-1){
				break;
			}else{
					if(this.data[r][c]==0){
						this.data[r][c]=this.data[r][nextc];
						this.data[r][nextc]=0;
						c--;
					}else if(this.data[r][c]==this.data[r][nextc]){
						this.data[r][c]*=2;
						//将r行c列的新值累加到score属性上
						this.score+=this.data[r][c];
						this.data[r][nextc]=0;
					}
			}
		}		
	},
	getNextInRow:function(r,c){
		//找r行c列右侧下一个不为0的位置
		//nextc从c+1开始，到<CN结束
			//如果r行nextc位置不等于0
				//返回nextc
		//(遍历结束)
		//返回-1
		for(var nextc=c+1;nextc<this.CN;nextc++){
			if(this.data[r][nextc]!=0){
				return nextc;
			}
		}
		return -1;
	},
	moveRight:function(){
		var before=String(this.data);
		for(var r=0;r<this.RN;r++){
			this.moveRightInRow(r);
		}
		var after=String(this.data);
		if(before!=after){
			this.randomNum();
			if(this.isGAMEOVER()==true){
				this.state=this.GAMEOVER;
			}
			this.updateView();
		}
	},
	moveRightInRow:function(r){//右移第r行
		//c从CN-1开始，反向遍历r行，到>0结束
			//找r行c列前一个不为0的位置prevc
			//如果prevc是-1，就退出循环
			//否则
				//如果r行c列式0
					//将r行prevc列的值赋值给r行c列
					//将r行prevc列置为0
					//c留在原地
				//否则，如果r行c列的值等于r行prevc列的值
					//将r行c列的值*2
					//将r行prevc列的值置为0
		for(var c=this.CN-1;c>0;c--){
			var prevc=this.getPrevInRow(r,c);
			if(prevc==-1){
				break;
			}else{
					if(this.data[r][c]==0){
						this.data[r][c]=this.data[r][prevc];
						this.data[r][prevc]=0;
						c++;
					}else if(this.data[r][c]==this.data[r][prevc]){
						this.data[r][c]*=2;
						//将r行c列的新值累加到score属性上
						this.score+=this.data[r][c];
						this.data[r][prevc]=0;
					}
			}
		}		
	},
	getPrevInRow:function(r,c){
		//查找r行c列右侧前一个不为0的位置
		//prevc从c-1开始，反向遍历，到>=0结束
			//如果r行prevc列不等于0
				//返回prevc
		//遍历结束
		//返回-1
		
		for(var prevc=c-1;prevc>=0;prevc--){
			if(this.data[r][prevc]!=0){
				return prevc;
			}
		}
		return -1;
		
	},
	moveUp:function(){
	  //为data拍照保存在before中
	  //遍历data中每一列
		//调用moveUpInCol上移第c列
	  //为data拍照保存在after中
	  //如果before不等于after
		//随机生成数
		//更新页面
		var before=String(this.data);
		for(var c=0;c<this.CN;c++){
			this.moveUpInCol(c);
		}
		var after=String(this.data);
		if(before!==after){
			this.randomNum();
			if(this.isGAMEOVER()==true){
				this.state=this.GAMEOVER;
			}
			this.updateView();
		}
	},
	moveUpInCol:function(c){
		//r从0开始,到r<RN-1结束，r每次递增1
		  //查找r行c列下方下一个不为0的位置nextr
		  //如果没找到,就退出循环
		  //否则  
			//如果r位置c列的值为0
			  //将nextr位置c列的值赋值给r位置
			  //将nextr位置c列置为0
			  //r留在原地
			//否则，如果r位置c列的值等于nextr位置的值          
		  //将r位置c列的值*2
			  //将nextr位置c列的值置为0
		for(var r=0;r<this.RN-1;r++){
			var nextr=this.getNextInCol(r,c);
			if(nextr==-1){
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[nextr][c];
					this.data[nextr][c]=0;
					r--;
				}else if(this.data[r][c]==this.data[nextr][c]){
					this.data[r][c]*=2;
					//将r行c列的新值累加到score属性上
					this.score+=this.data[r][c];
					this.data[nextr][c]=0;
				}
			}
			
		}
	},
	getNextInCol:function(r,c){
		//r+1
		//循环，到<RN结束，r每次递增1
		  //如果r位置c列不等于0
			//返回r
		//(遍历结束)
		//返回-1
		for(var nextr=r+1;nextr<this.RN;nextr++){
			if(this.data[nextr][c]!=0){
				return nextr;
			}
		}
		return -1;
	},
	moveDown:function(){
	  //为data拍照保存在before中
	  //遍历data中每一列
		//调用moveDownInCol下移第c列
	  //为data拍照保存在after中
	  //如果before不等于after
		//随机生成数
		//更新页面
		var before=String(this.data);
		for(var c=0;c<this.CN;c++){
			this.moveDownInCol(c);
		}
		var after=String(this.data);
		if(before!==after){
			this.randomNum();
			if(this.isGAMEOVER()==true){
				this.state=this.GAMEOVER;
			}
			this.updateView();
		}
	},
	moveDownInCol:function(c){
		//r从RN-1开始，到r>0结束，r每次递减1
		  //查找r位置c列上方前一个不为0的位置prevr
		  //如果没找到,就退出循环
		  //否则  
			//如果r位置c列的值为0
			  //将prevr位置c列的值赋值给r位置
			  //将prevr位置c列置为0
			  //r留在原地
			//否则，如果r位置c列的值等于prevr位置的值
			  //将r位置c列的值*2
			  //将prevr位置c列置为0
		for(var r=this.RN-1;r>0;r--){
			var prevr=this.getPrevInCol(r,c);
			if(prevr==-1){
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[prevr][c];
					this.data[prevr][c]=0;
					r++;
				}else if(this.data[r][c]==this.data[prevr][c]){
					this.data[r][c]*=2;
					//将r行c列的新值累加到score属性上
					this.score+=this.data[r][c];
					this.data[prevr][c]=0;
				}
			}
			//debugger;
		}
	},
	getPrevInCol:function(r,c){
		//r-1
		//循环，r到>=0结束，每次递减1
		  //如果r位置c列不等于0
			//返回r
		//(遍历结束)
		//返回-1
		for(var prevr=r-1;prevr>=0;prevr--){
			if(this.data[prevr][c]!=0){
				return prevr;
			}
		}
		return -1;
	},
	
}	
game.start();