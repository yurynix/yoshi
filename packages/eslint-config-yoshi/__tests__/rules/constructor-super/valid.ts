class B {
  foo() {
    return 'bar';
  }
}

class A extends B {
  constructor() {
    super();

    console.log('test');
  }

  hello() {
    return 'world';
  }
}
