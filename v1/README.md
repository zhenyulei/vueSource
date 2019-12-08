# self-vue第一个版本

### 1.从html模板开始
```js
var selfVue = new SelfVue({
  name: 'hello world'
}, ele, 'name');
```
在index中定义的该函数类：
```js
//SelfVue有三个参数：data,el,exp;
//data就是{name: 'hello world'}
//el就是 document.querySelector('#name')
//exp 就是模板中用到数据key值
function SelfVue (data, el, exp){
    self.proxyKeys(key); //定义了 SelfVue 的 get 和set函数；get返回data中的值；set设置data中的值
    observe(data);//在这里定义观察者模式--get、set
    el.innerHTML = this.data[exp];//首次初始化的时候
    /*
    首次初始化的时候，在这里虽然调用observe中的get函数，但此时的 Dep.target 均为null，所以不会执行依赖收集；
    只有在Dep.target有值的时候，才会进行依赖收集；

new Watcher()的时候会执行 this.value = this.get();
get: function() {
    Dep.target = this;  // 缓存自己
    var value = this.vm.data[this.exp]  
    Dep.target = null;  // 释放自己
    return value;
}
其中 this.vm.data[this.exp] 该语句调用了 vm中模板中使用的data值，也就是使用了
observer中的get函数：
get: function() {
    if (Dep.target) {
        dep.addSub(Dep.target);
    }
    return val;
},
因为watcher中get函数先定义了 Dep.target = this; 所以是有Dep.target的
所以可以执行
dep.addSub(Dep.target);
也就是把该watcher依赖放在了 dep 中；

    只有执行new watcher的时候才会有 Dep.target，执行完之后，Dep.target 就会将其改为null；
    所以，其他地方调用了data值，由于没有用到watcher，也不会添加依赖。
    而watcher只有在模板中用到，即只会给有exp的添加 Dep.target
    if (Dep.target) {
      dep.addSub(Dep.target);
    }
    */  
    new Watcher(this, exp, function (value) {
        el.innerHTML = value; //更新时变化
    });
    /*
    new Watcher()
    构造函数中的 this.value = this.get(); 
    会执行 watcher中的get-->var value = this.vm.data[this.exp]
    这样就会执行observe中的get方法--> dep.addSub(Dep.target);
    即把cb-vm-exp-value的watcher放在 dep中保存下来
    cb是更新视图的函数；
    vm是vue实例，包括data，生命周期，方法等属性
    exp 模板中用到的数据的值
    后续会循环遍历模板中的data值{{name}}，将其变成exp
    */
    return this;
}

```

下面是set函数的执行，也就是执行的监听更新机制：
在html中 
selfVue.name = 'canfoo';
此时执行的就是 observer.js
```js
set: function(newVal) {
  if (newVal === val) {
    return;
  }
  val = newVal;
  dep.notify();//只有在数据发生变化的时候，才去通知更新
}
```
```js
Dep.prototype = {
    notify: function() { 
      //把所有之前进行过依赖的subs进行循环
      //subs里面存的是之前监听的watcher,也就是执行update中的update函数
        this.subs.forEach(function(sub) {
            sub.update(); 
        });
    }
};
```
sub.update()--->this.run()
```js
run: function() {
    var value = this.vm.data[this.exp];
    //在这里获取data值，但是Dep.target=null，所以不会进行依赖收集
    var oldVal = this.value;
    if (value !== oldVal) {
        this.value = value;
        this.cb.call(this.vm, value, oldVal);//cb函数就是更新vm函数
    }
}
//
new Watcher(this, exp, function (value) {
    el.innerHTML = value;
});
```

所以cb就是
function (value) {
    el.innerHTML = value;
}