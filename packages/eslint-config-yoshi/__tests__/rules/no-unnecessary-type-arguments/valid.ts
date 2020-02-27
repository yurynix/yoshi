function f<T = number>() {}
f<string>();

function g<T = number, U = string>() {}
g<number, number>();

class C<T = number> {}
new C<string>();
class D extends C<string> {}

interface I<T = number> {}
class Impl implements I<string> {}
