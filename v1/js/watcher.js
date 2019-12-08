function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.value = this.get();  // 将自己添加到订阅器的操作
}

Watcher.prototype = {
    update: function() {
        this.run();
    },
    run: function() {
        var value = this.vm.data[this.exp];
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },
    get: function() {
        Dep.target = this;  // 缓存自己
        var value = this.vm.data[this.exp]  // 强制执行监听器里的get函数，把当前的watcher，放在dep中
        Dep.target = null;  // 释放自己
        return value;
    }
};

/*
// Watcher中强制执行监听器里的get函数，即把当前的watcher，放在dep中
get: function() {
    if (Dep.target) {
        dep.addSub(Dep.target);
    }
    return val;
},
*/

/*
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
*/