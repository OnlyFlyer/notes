function WePay () {}
function AliPay() {}
function CustomPay() {}

class Base {
  config = {
    1: WePay,
    2: AliPay,
    3: CustomPay
  }
}

class Test extends Base {
  getPayMethod(type) {
    return this.config[type]
  }
}