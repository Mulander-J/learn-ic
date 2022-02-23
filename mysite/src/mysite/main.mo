import MyUtils "MyUtils";

actor {
    public func greet(name : Text) : async Text {
        return "Hello, " # name # "!";
    };

    public func fibonaci(x:Nat): async Nat{
        MyUtils.fib(x)
    };

    public func quickSort(arr:[Int]) : async [Int] {
        MyUtils.qSort(arr);
    };
};