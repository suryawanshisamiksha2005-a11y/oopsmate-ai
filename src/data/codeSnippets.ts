export interface CodeSnippet {
  id: string;
  title: string;
  concept: string;
  code: string;
  description: string;
}

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: "class-basics",
    title: "1. Class, Encapsulation & Access Specifiers",
    concept: "Core OOP",
    description: "Demonstrates data hiding, private member variables, and public getter/setter methods with validation.",
    code: `#include <iostream>
#include <string>

class BankAccount {
private:
    std::string accountHolder;
    double balance;

public:
    BankAccount(std::string name, double initialDeposit) 
        : accountHolder(name), balance(initialDeposit > 0 ? initialDeposit : 0.0) {}

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            std::cout << "[SUCCESS] Deposited: $" << amount << "\\n";
        }
    }

    bool withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            std::cout << "[SUCCESS] Withdrew: $" << amount << "\\n";
            return true;
        }
        std::cout << "[DENIED] Insufficient funds or invalid amount.\\n";
        return false;
    }

    void displayStatement() const {
        std::cout << "Holder: " << accountHolder << " | Current Balance: $" << balance << "\\n";
    }
};

int main() {
    BankAccount myAccount("Alex Chen", 1250.0);
    myAccount.displayStatement();
    myAccount.deposit(500.0);
    myAccount.withdraw(300.0);
    myAccount.displayStatement();
    return 0;
}`
  },
  {
    id: "virtual-functions",
    title: "2. Runtime Polymorphism & Virtual Functions",
    concept: "Polymorphism",
    description: "Shows dynamic binding via base class pointer with virtual functions and pure virtual area calculation.",
    code: `#include <iostream>
#include <vector>
#include <memory>

class GraphicShape {
public:
    virtual void render() const {
        std::cout << "Rendering generic shape on screen.\\n";
    }
    virtual double calculateArea() const = 0; // Pure virtual function
    virtual ~GraphicShape() = default;        // Mandatory virtual destructor
};

class Circle : public GraphicShape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    void render() const override {
        std::cout << "Drawing Circle with radius " << radius << "\\n";
    }
    double calculateArea() const override {
        return 3.14159 * radius * radius;
    }
};

class Square : public GraphicShape {
private:
    double side;
public:
    Square(double s) : side(s) {}
    void render() const override {
        std::cout << "Drawing Square with side " << side << "\\n";
    }
    double calculateArea() const override {
        return side * side;
    }
};

int main() {
    std::vector<std::unique_ptr<GraphicShape>> canvas;
    canvas.push_back(std::make_unique<Circle>(7.0));
    canvas.push_back(std::make_unique<Square>(5.0));

    for (const auto& shape : canvas) {
        shape->render(); // Dynamically dispatched via vtable!
        std::cout << "Computed Area: " << shape->calculateArea() << "\\n\\n";
    }
    return 0;
}`
  },
  {
    id: "diamond-problem",
    title: "3. Diamond Problem & Virtual Base Class",
    concept: "Inheritance",
    description: "Demonstrates resolving hybrid multipath inheritance duplication using virtual public inheritance.",
    code: `#include <iostream>

class Device {
public:
    int deviceId;
    Device(int id = 100) : deviceId(id) {
        std::cout << "Device Base Constructor: ID = " << deviceId << "\\n";
    }
};

// Virtual inheritance ensures only ONE shared Device subobject
class Scanner : virtual public Device {
public:
    Scanner() { std::cout << "Scanner Constructed\\n"; }
    void scan() { std::cout << "Scanning document via Device " << deviceId << "\\n"; }
};

class Printer : virtual public Device {
public:
    Printer() { std::cout << "Printer Constructed\\n"; }
    void print() { std::cout << "Printing document via Device " << deviceId << "\\n"; }
};

class AllInOneStation : public Scanner, public Printer {
public:
    // Most-derived class initializes the virtual base class directly
    AllInOneStation(int id) : Device(id), Scanner(), Printer() {
        std::cout << "AllInOneStation Constructed\\n";
    }
};

int main() {
    AllInOneStation station(909);
    station.scan();
    station.print();
    std::cout << "DeviceId accessed directly without ambiguity: " << station.deviceId << "\\n";
    return 0;
}`
  },
  {
    id: "operator-overloading",
    title: "4. Operator Overloading & Friend Stream <<",
    concept: "Operator Overloading",
    description: "Overloads binary + and non-member stream insertion << for complex arithmetic.",
    code: `#include <iostream>

class Vector2D {
private:
    float x, y;

public:
    Vector2D(float xVal = 0.0f, float yVal = 0.0f) : x(xVal), y(yVal) {}

    // Overloading binary + operator
    Vector2D operator+(const Vector2D& rhs) const {
        return Vector2D(this->x + rhs.x, this->y + rhs.y);
    }

    // Overloading scalar multiplication *
    Vector2D operator*(float scalar) const {
        return Vector2D(this->x * scalar, this->y * scalar);
    }

    // Overloading stream insertion << as friend function
    friend std::ostream& operator<<(std::ostream& os, const Vector2D& vec) {
        os << "(" << vec.x << ", " << vec.y << ")";
        return os;
    }
};

int main() {
    Vector2D v1(3.0f, 4.0f);
    Vector2D v2(1.5f, 2.5f);

    Vector2D v3 = v1 + v2;
    Vector2D v4 = v1 * 2.0f;

    std::cout << "v1 = " << v1 << "\\n";
    std::cout << "v2 = " << v2 << "\\n";
    std::cout << "v1 + v2 = " << v3 << "\\n";
    std::cout << "v1 * 2 = " << v4 << "\\n";
    return 0;
}`
  },
  {
    id: "smart-pointers-raii",
    title: "5. Modern C++ Smart Pointers & RAII",
    concept: "Memory Management",
    description: "Demonstrates zero-overhead std::unique_ptr with move semantics and std::shared_ptr reference counting.",
    code: `#include <iostream>
#include <memory>

class HeavyResource {
private:
    int resourceId;
public:
    HeavyResource(int id) : resourceId(id) {
        std::cout << "Acquired Resource [" << resourceId << "]\\n";
    }
    ~HeavyResource() {
        std::cout << "Freed Resource [" << resourceId << "] safely!\\n";
    }
    void process() const {
        std::cout << "Processing data on resource " << resourceId << "\\n";
    }
};

void runDemo() {
    // 1. std::unique_ptr: exclusive ownership
    std::cout << "--- std::unique_ptr ---\\n";
    auto u1 = std::make_unique<HeavyResource>(101);
    u1->process();
    // Ownership transferred via move
    std::unique_ptr<HeavyResource> u2 = std::move(u1);
    std::cout << "u1 is now: " << (u1 ? "Valid" : "nullptr") << "\\n";

    // 2. std::shared_ptr: reference counted ownership
    std::cout << "\\n--- std::shared_ptr ---\\n";
    auto s1 = std::make_shared<HeavyResource>(202);
    std::cout << "Current owners: " << s1.use_count() << "\\n";
    {
        auto s2 = s1;
        std::cout << "Inner block owners: " << s1.use_count() << "\\n";
    }
    std::cout << "Outer block owners: " << s1.use_count() << "\\n";
}

int main() {
    runDemo();
    std::cout << "Execution completed cleanly with zero memory leaks.\\n";
    return 0;
}`
  },
  {
    id: "templates-generic",
    title: "6. Generic Programming with Class Templates",
    concept: "Templates",
    description: "Builds a generic type-safe Stack<T> class template supporting int, string, and custom types.",
    code: `#include <iostream>
#include <string>
#include <stdexcept>

template <typename T, size_t MaxCapacity = 5>
class SafeStack {
private:
    T elements[MaxCapacity];
    int topIndex;

public:
    SafeStack() : topIndex(-1) {}

    bool isEmpty() const { return topIndex == -1; }
    bool isFull() const { return topIndex == static_cast<int>(MaxCapacity) - 1; }

    void push(const T& value) {
        if (isFull()) throw std::overflow_error("Stack Overflow: capacity reached!");
        elements[++topIndex] = value;
    }

    T pop() {
        if (isEmpty()) throw std::underflow_error("Stack Underflow: stack is empty!");
        return elements[topIndex--];
    }
};

int main() {
    try {
        // Stack of integers
        SafeStack<int, 3> intStack;
        intStack.push(10);
        intStack.push(20);
        intStack.push(30);
        std::cout << "Popped Int: " << intStack.pop() << "\\n";

        // Stack of strings
        SafeStack<std::string, 3> strStack;
        strStack.push("Object");
        strStack.push("Oriented");
        strStack.push("Programming");
        std::cout << "Popped String: " << strStack.pop() << "\\n";
    } catch (const std::exception& e) {
        std::cerr << "Exception caught: " << e.what() << "\\n";
    }
    return 0;
}`
  }
];
