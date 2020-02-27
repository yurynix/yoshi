function f<T = number>() {}
f<number>();

function g<T = number, U = string>() {}
g<string, string>();

class C<T = number> {}
function h(c: C<number>) {}
new C<number>();
class D extends C<number> {}

interface I<T = number> {}
class Impl implements I<number> {}
