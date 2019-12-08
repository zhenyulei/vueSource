/*
var ele = document.querySelector('#name');
var selfVue = new SelfVue({
   name: 'hello world'
}, ele, 'name');

data = {name: 'hello world'};
el = document.querySelector('#name');
exp = 'name';也就是模版中用到的data属性值
*/

function SelfVue (data, el, exp) {
    var self = this;
    this.data = data;

    Object.keys(data).forEach(function(key) {
        self.proxyKeys(key);
    });

    observe(data);
    /*
    先执行 observe，即先定义get、set方法；
    在后面执行new Watcher()的时候，构造函数中的 this.value = this.get(); 
    会执行 watcher中的get-->var value = this.vm.data[this.exp]
    这样就会执行observe中的get方法--> dep.addSub(Dep.target);
    即把cb-vm-exp-value的watcher放在 dep中保存下来
    cb是更新视图的函数；
    vm是vue实例，包括data，生命周期，方法等属性
    exp 模板中用到的数据的值
    后面执行  
    */
    el.innerHTML = this.data[exp];  
    new Watcher(this, exp, function (value) {
        el.innerHTML = value;
    });
    return this;
}

SelfVue.prototype = {
    proxyKeys: function (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function proxyGetter() {
                return self.data[key];
            },
            set: function proxySetter(newVal) {
                self.data[key] = newVal;
            }
        });
    }
}
