export const throttle=(fn,interval)=>{
    let _self=fn,
         timer=null,
         firstTime=true;
    return function(){
        let args=arguments,
            _me=this;

            if(firstTime){
                _self.apply(_me,args);
                firstTime=false;
            }

            if(timer){
                return false;
            }

            timer=setTimeout(() => {
                clearTimeout(timer);
                timer=null;
                _self.apply(_me,args);
            }, interval||500);
    }
}