import React from 'react';
require('../styles/App.scss');

class ImgFigure extends React.Component{
    constructor(){
        super()
    }
    handleClick(e){
        const {inreverse,incenter}=this.props;
        const iscenter=this.props.arrange.iscenter;
        if(iscenter&&inreverse){
            inreverse();
        }else{
            incenter();
        }
        e.stopPropagation();
        e.preventDefault();
    }
    render(){
        let styleObj={};
        //如果props属性中指定了这张图片的位置，则使用
        if(this.props.arrange.pos){
            styleObj=this.props.arrange.pos;
        }

        // 如果存在角度 则给每张图片设置角度
        if(this.props.arrange.rotate){
            styleObj=Object.assign({},styleObj,{
                transform:`rotate(${this.props.arrange.rotate}deg)`
            })
        }

        //维护figure的类名
        let figureClassName='img-figure';
        figureClassName +=this.props.arrange.isreverse?' reverse':'';

        return(
            <figure className={figureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
                <img src={this.props.data.imageURL} alt={this.props.data.title} />
                <figcaption>
                    <h2>{this.props.data.title}</h2>
                   
                </figcaption>
                <div className="img-back">
                        {this.props.data.desc}
                </div>
            </figure>
        )
    }
};

export default ImgFigure;