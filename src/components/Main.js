import React from 'react';
import ReactDom from 'react-dom';
import ImgFigure from './imageFigure';
import {throttle} from '../util/util';

import '../styles/App.scss';

//获取图片相关数据
let imageDatas=require('../data/imageDatas.json');
//将图片信息转成图片url路径的信息
imageDatas=(function(imageDatasArr){
  for(let i=0,len=imageDatasArr.length;i<len;i++){
    let singleImageData=imageDatasArr[i];

    singleImageData.imageURL=require(`../images/${singleImageData.fileName}`);
    imageDatasArr[i]=singleImageData;
  }
  return imageDatasArr;
})(imageDatas)


class AppComponent extends React.Component {
  constructor(){
    super()
    this.state={
      Constant:{
        // 中间图片的位置
        centerPos:{
          left:0,
          right:0,
          zIndex:13
        },
        // 水平方向,左右两边图片位置的取值范围
        xRange:{
          leftSecX:[0,0],
          rightSecX:[0,0],
          y:[0,0]
        },
        // 垂直方向，上面图片的取值范围
        yRange:{
          x:[0,0],
          topY:[0,0]
        }
      },
      imgsArrangeArr:[
        /*{
          pos:{
            left:'0',
            top:'0'
          },
          rotate:0,
          iscenter:false,
          isreserve:false
        }*/
      ],
      centerIndex:0
    }
  }
  rangeCaculate(){
    // 组件加载以后，为每张图片计算其位置的范围
    const stageDom=ReactDom.findDOMNode(this.refs.stage),
    stageW=stageDom.scrollWidth,
    stageH=stageDom.scrollHeight,
    halfStageW=Math.ceil(stageW/2),
    halfStageH=Math.ceil(stageH/2);

    // 拿到一个imageFigure的大小
    const imgFigureDOM=ReactDom.findDOMNode(this.refs.imgFigure0),
    imgW=imgFigureDOM.scrollWidth,
    imgH=imgFigureDOM.scrollWidth,
    halfImgW=Math.ceil(imgW/2),
    halfImgH=Math.ceil(imgH/2);

    this.state.Constant={
      // 计算中间图片的位置
      centerPos:{
      left:halfStageW-halfImgW,
      top:halfStageH-halfImgH,
      zIndex:13
      },
      // 计算左侧，右侧图片位置取值范围
      xRange:{
        leftSecX:[-halfImgW,halfStageW-halfImgW*3],
        rightSecX:[halfStageW+halfImgW,stageW-halfImgW],
        y:[-halfImgH,stageH-halfImgH]
      },
      // 计算上侧区域图片排布位置的取值范围
      yRange:{
        topY:[-halfImgH,-imgH/3],
        x:[halfStageW-halfImgW,halfStageW+halfImgW]
      }
    }
  }
  /*
   *重新布局所有图片
   *@parameter centerIndex指定居中排布的那个图片
   */
  rearrange=(centerIndex)=>{
    const imgsArrangeArr=this.state.imgsArrangeArr,//图片库
          /* 范围变量 */
          Constant=this.state.Constant,
          centerPos=Constant.centerPos,
          xRangeLeftSecX=Constant.xRange.leftSecX,
          xRangeRightSecX=Constant.xRange.rightSecX,
          xRangeY=Constant.xRange.y,
          yRangeTopY=Constant.yRange.topY,
          yRangeX=Constant.yRange.x;

      let imgsArrangeTopArr=[],//用于临时存放上部的图片
          topImgNum=Math.floor(Math.random()*2),//取一个或者不取
          topImgSpliceIndex=0,//从图片库中开始截取上部图片的索引
          imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);
          //先居中 中间的图片 不旋转
          imgsArrangeCenterArr[0]={
            pos:centerPos,
            iscenter:true,
            isreverse:false,
            rotate:0
          };
          //截取出上部的图片
          topImgSpliceIndex=Math.floor(Math.random()*(imgsArrangeArr.length-topImgNum)-1);
          imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
          //排布上侧的图片
          imgsArrangeTopArr.map((item)=>{            
              item.pos={
                left:this.getRangeRandom(yRangeX[0],yRangeX[1]),
                top:this.getRangeRandom(yRangeTopY[0],yRangeTopY[1])
              };
              item.iscenter=false;
              item.isreverse=false;
              item.rotate=this.setPicRotateDeg();
            return item
          });
          //布局左右两侧的图片
          for(let i=0,len=imgsArrangeArr.length,k=len/2;i<len;i++){
            let xPosRangeLORX=null;

            //前半部分在左边，右半部分在右边
            if( i < k ){
              xPosRangeLORX=xRangeLeftSecX;
            }else{
              xPosRangeLORX=xRangeRightSecX;
            }
            imgsArrangeArr[i]={
              pos:{
                top:this.getRangeRandom(xRangeY[0],xRangeY[1]),
                left:this.getRangeRandom(xPosRangeLORX[0],xPosRangeLORX[1])
              },
              iscenter:false,
              isreverse:false,
              rotate:this.setPicRotateDeg()
            };
          }
          // 把取出的图片塞回去 先塞上面的再塞中间的避免数组索引出错
          if(imgsArrangeTopArr.length>0){
            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0] );
          }
          imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0] );
         
          this.setState({
            imgsArrangeArr:imgsArrangeArr
          });
  }
  // 取范围内的随机数
  getRangeRandom(low,high){
    return Math.random()*(high-low)+low;
  }
  // 设置每张图片的旋转角度 0-30度之间
  setPicRotateDeg(){
    return (Math.random()>0.5?'':'-')+Math.ceil(Math.random()*30);
  }
  // 点击翻转图片 根据传入的index 确定翻转的图片
  reserve(index){
    return ()=>{
      let imgsArrangeArr=this.state.imgsArrangeArr;
      imgsArrangeArr[index].isreverse=!imgsArrangeArr[index].isreverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }
  }
  // 将图片设为居中
  setCenter(index){
    return ()=>{
      this.setState({
        centerIndex:index
      });
      this.rearrange(index);
    }
  }
  // 改变视窗大小时重新计算可视区范围
  onWindowResize(){
      this.rangeCaculate();
      this.rearrange(this.state.centerIndex);
  }
  componentDidMount(){
    this.rangeCaculate();
    this.rearrange(this.state.centerIndex);

    window.addEventListener('resize',throttle(this.onWindowResize.bind(this),500));
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this.onWindowResize);
  }
  render() {
    let controllerUnits=[],
    imgFigures=[];

    /* 初始化imgsArrangeArr
    * 将获取到的图片信息
    * 传入单个图片组建
    * 推入一个数组直接引用
    */
    imageDatas.map((item,index)=>{
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index]={
          pos:{
            left:'0',
            top:'0'
          },
          rotate:0,
          iscenter:false,
          isreverse:false
        }
      }

      imgFigures.push(<ImgFigure key={index}
                                index={index}
                                arrange={this.state.imgsArrangeArr[index]}
                                inreverse={this.reserve(index).bind(this)}
                                incenter={this.setCenter(index).bind(this)}
                                ref={'imgFigure'+index} data={item} />)
    });
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controll-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
