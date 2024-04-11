
// 观察者模式是一种行为型设计模式，它定义了一种一对多的依赖关系，当一个对象的状态发生改
// 变时，其依赖者（观察者）会自动收到通知并更新。观察者模式的主要特性包括：

// 1.主题（被观察者）（Subject）：它是被观察的对象，当其状态发生改变时会通知所有的观察者。
// 2.观察者（Observer）：它是观察主题的对象，当主题（被观察者）状态发生改变时会接收到通知并进行相应的处理。
// 3.通知机制：主题（被观察者）在状态变化时会主动通知所有注册的观察者对象。

// 最佳实践及代码示例： 在前端开发中，观察者模式常用于以下场景：
// 事件处理：通过事件机制实现了观察者模式。DOM事件、自定义事件等都是基于观察者模式实现的。
// 数据绑定：当数据发生变化时，自动更新相关视图。

class Subject {
  constructor() {
    this.observers = []
  }

  addObserver(observer) {
    this.observers.push(observer)
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer)
  }

  notify(data) {
    this.observers.forEach(obs => obs.update(data))
  }
}

class Observer {
  update(data) {
    console.log(`Received data: ${data}`)
  }
}

// Usage
const subject = new Subject()
const observer1 = new Observer()
const observer2 = new Observer()

subject.addObserver(observer1)
subject.addObserver(observer2)

subject.notify('Hello, world!')
// Output:
// Received data: Hello, world!
// Received data: Hello, world!

subject.removeObserver(observer1)

subject.notify('Goodbye, world!')
// Output:
// Received data: Goodbye, world!

