export interface SyllabusTopic {
  id: string;
  unit: number;
  title: string;
  tag: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  definition: string;
  syntax: string;
  exampleCode: string;
  expectedOutput: string;
  explanation: string[];
  analogy: string;
  commonMistakes: string[];
  examPointers: string[];
}

export const SYLLABUS_TOPICS: SyllabusTopic[] = [
  {
    id: "classes-objects",
    unit: 1,
    title: "Classes & Objects",
    tag: "Core Foundations",
    difficulty: "Beginner",
    definition: "A class is a user-defined blueprint or template that binds data members and member functions together. An object is an identifiable, instantiated runtime entity of a class that occupies real memory in the heap or stack.",
    syntax: `class ClassName {
    private:
        // Data members (hidden)
    public:
        // Member functions (interface)
};

ClassName objectName; // Instantiation`,
    exampleCode: `#include <iostream>
#include <string>

class Student {
private:
    std::string name;
    int rollNo;
    float cgpa;

public:
    void setDetails(std::string n, int r, float c) {
        name = n;
        rollNo = r;
        cgpa = c;
    }

    void display() const {
        std::cout << "Student: " << name 
                  << " | Roll No: " << rollNo 
                  << " | CGPA: " << cgpa << std::endl;
    }
};

int main() {
    Student s1; // Object instantiated on stack
    s1.setDetails("Arya Sharma", 101, 9.42f);
    s1.display();
    return 0;
}`,
    expectedOutput: `Student: Arya Sharma | Roll No: 101 | CGPA: 9.42`,
    explanation: [
      "The class 'Student' declares private attributes to enforce security, preventing direct illegal tampering.",
      "Public methods 'setDetails' and 'display' act as the authorized API to interact with object state.",
      "The object 's1' is allocated on the function stack frame when main() starts and automatically deallocated when it exits.",
      "The member access operator (.) is used to invoke member functions on object instances."
    ],
    analogy: "A class is like an architectural blueprint of an electric car. An object is the actual manufactured physical car parked in your garage holding battery charge and odometer readings.",
    commonMistakes: [
      "Forgetting the terminating semicolon (;) after the closing curly brace of class definition.",
      "Assuming private members are accessible directly in main() using s1.name.",
      "Confusing class size with empty class: an empty class in C++ still has sizeof == 1 byte to ensure unique memory addresses."
    ],
    examPointers: [
      "University 2-Mark: State 2 differences between structure (struct) and class in C++ (Default visibility: struct is public, class is private).",
      "University 5-Mark: Explain the memory layout of an object with an annotated diagram showing data member alignment and padding."
    ]
  },
  {
    id: "encapsulation-abstraction",
    unit: 1,
    title: "Encapsulation & Abstraction",
    tag: "Core Foundations",
    difficulty: "Beginner",
    definition: "Encapsulation is the mechanism of wrapping data and member methods into a single protective unit while restricting unauthorized access. Abstraction is the design process of displaying only essential features while concealing internal implementation complexities.",
    syntax: `class BankAccount {
private:
    double balance; // Encapsulated internal state
public:
    void deposit(double amount); // Abstract interface
    double getBalance() const;
};`,
    exampleCode: `#include <iostream>

class BankAccount {
private:
    double balance; // Encapsulated & protected from outside direct modification

public:
    BankAccount(double initialBalance) {
        balance = (initialBalance >= 0) ? initialBalance : 0.0;
    }

    // Abstraction: User only needs to know deposit works; internal ledger validation is hidden
    bool withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }

    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    double getBalance() const {
        return balance;
    }
};

int main() {
    BankAccount account(5000.0);
    account.deposit(1500.0);
    account.withdraw(2000.0);
    std::cout << "Verified Balance: INR " << account.getBalance() << std::endl;
    return 0;
}`,
    expectedOutput: `Verified Balance: INR 4500`,
    explanation: [
      "Encapsulation binds the 'balance' variable inside the BankAccount boundary and shields it with private visibility.",
      "Withdrawal logic contains business invariants: balance cannot drop below zero, preventing illegal overdrafts.",
      "Abstraction gives the consumer clean APIs (deposit, withdraw) without requiring them to know cryptographic checks or hashing happening underneath."
    ],
    analogy: "Driving a sports car: the steering wheel, pedals, and gear shift are the Abstraction. The internal combustion engine, electronic fuel injectors, and differential gearbox sealed under the hood are Encapsulation.",
    commonMistakes: [
      "Treating Encapsulation and Abstraction as identical: Encapsulation is 'information hiding & bundling' (how to secure it); Abstraction is 'interface design' (what to show).",
      "Creating public data members and claiming the class achieves encapsulation."
    ],
    examPointers: [
      "University Favorite: Tabulate 4 key differences between Encapsulation and Data Abstraction.",
      "Explain how access specifiers (private, protected, public) facilitate data hiding."
    ]
  },
  {
    id: "constructors-types",
    unit: 1,
    title: "Constructors: Default, Parameterized, Copy & Move",
    tag: "Object Lifecycle",
    difficulty: "Intermediate",
    definition: "A constructor is a special member function having the identical name as its class, without any return type (not even void), automatically invoked when an object instance is created to initialize its state.",
    syntax: `class Vector2D {
    float x, y;
public:
    Vector2D();                            // Default
    Vector2D(float xVal, float yVal);       // Parameterized
    Vector2D(const Vector2D& other);       // Deep Copy Constructor
    Vector2D(Vector2D&& other) noexcept;   // Move Constructor (C++11)
};`,
    exampleCode: `#include <iostream>
#include <utility>

class DynamicArray {
private:
    int* data;
    size_t size;

public:
    // 1. Parameterized Constructor
    DynamicArray(size_t s) : size(s), data(new int[s]) {
        for (size_t i = 0; i < size; ++i) data[i] = (i + 1) * 10;
        std::cout << "Parameterized Constructor: allocated " << size << " ints\\n";
    }

    // 2. Deep Copy Constructor
    DynamicArray(const DynamicArray& other) : size(other.size), data(new int[other.size]) {
        for (size_t i = 0; i < size; ++i) data[i] = other.data[i];
        std::cout << "Deep Copy Constructor: cloned " << size << " ints\\n";
    }

    // 3. Move Constructor (C++11 RAII)
    DynamicArray(DynamicArray&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr; // Pilfer resource without deep cloning
        other.size = 0;
        std::cout << "Move Constructor: pilfered ownership without reallocation\\n";
    }

    ~DynamicArray() {
        delete[] data;
        std::cout << "Destructor executed (freed buffer)\\n";
    }

    void printFirst() const {
        if (data) std::cout << "First Element = " << data[0] << "\\n";
    }
};

int main() {
    DynamicArray arr1(3);
    DynamicArray arr2 = arr1;              // Invokes Deep Copy Constructor
    DynamicArray arr3 = std::move(arr1);   // Invokes Move Constructor
    arr2.printFirst();
    return 0;
}`,
    expectedOutput: `Parameterized Constructor: allocated 3 ints
Deep Copy Constructor: cloned 3 ints
Move Constructor: pilfered ownership without reallocation
First Element = 10
Destructor executed (freed buffer)
Destructor executed (freed buffer)
Destructor executed (freed buffer)`,
    explanation: [
      "If a class contains dynamically allocated heap memory (int* data), the default compiler-generated copy constructor performs a shallow copy (pointer address copy), resulting in double-free crashes.",
      "The custom copy constructor performs a deep copy by allocating a new buffer and copying values element-by-element.",
      "The move constructor (with && rvalue reference) transfers the existing pointer directly to the new instance in O(1) time and resets other.data to nullptr.",
      "Member initializer lists (: size(s), data(new int[s])) initialize attributes before constructor body entry, avoiding redundant default construction."
    ],
    analogy: "Copying a 500-page notebook: Shallow copy gives someone your address and you both fight over 1 notebook. Deep copy photocopies every page. Move gives your original notebook to your friend and leaves you with an empty hand.",
    commonMistakes: [
      "Not writing a deep copy constructor when using raw pointers (leads to glibc 'double free or corruption' runtime crash).",
      "Passing object by value in copy constructor: DynamicArray(DynamicArray other) causes infinite recursive copy construction. Must be passed by const reference (const DynamicArray& other).",
      "Forgetting to set pilfered pointer to nullptr in move constructor."
    ],
    examPointers: [
      "University 5-Mark: Explain the Rule of Three / Rule of Five in modern C++ (Destructor, Copy Constructor, Copy Assignment, Move Constructor, Move Assignment).",
      "Why must the parameter of a Copy Constructor be passed by reference?"
    ]
  },
  {
    id: "destructors-execution-order",
    unit: 1,
    title: "Destructors & Order of Execution",
    tag: "Object Lifecycle",
    difficulty: "Intermediate",
    definition: "A destructor is a special member function with a tilde (~) prefix, no parameters, and no return type. It is invoked automatically when an object goes out of scope or is explicitly deleted, releasing resources like heap buffers, sockets, and file handles.",
    syntax: `class DatabaseConn {
public:
    DatabaseConn();  // Resource acquisition
    ~DatabaseConn(); // Resource release (RAII)
};`,
    exampleCode: `#include <iostream>

class Tracker {
private:
    int id;
public:
    Tracker(int identifier) : id(identifier) {
        std::cout << "Constructor called for Object " << id << std::endl;
    }
    ~Tracker() {
        std::cout << "Destructor called for Object " << id << std::endl;
    }
};

int main() {
    std::cout << "Entering main()\\n";
    Tracker t1(1);
    {
        std::cout << "Entering inner block\\n";
        Tracker t2(2);
        Tracker t3(3);
        std::cout << "Exiting inner block\\n";
    }
    std::cout << "Exiting main()\\n";
    return 0;
}`,
    expectedOutput: `Entering main()
Constructor called for Object 1
Entering inner block
Constructor called for Object 2
Constructor called for Object 3
Exiting inner block
Destructor called for Object 3
Destructor called for Object 2
Exiting main()
Destructor called for Object 1`,
    explanation: [
      "Stack-allocated objects are destroyed in exact reverse order of their construction (LIFO - Last In, First Out).",
      "Objects created inside nested curly brace blocks are destroyed the moment execution leaves the closing brace.",
      "Destructors take 0 arguments, so destructor overloading is strictly prohibited in C++.",
      "In inheritance hierarchies, base constructors run before derived constructors, but derived destructors run before base destructors."
    ],
    analogy: "Putting on winter clothes: you wear shirt first, then sweater, then jacket. When taking them off, you remove the jacket first, then sweater, and finally shirt (LIFO).",
    commonMistakes: [
      "Attempting to overload destructors with parameters (compiler rejects with compilation error).",
      "Throwing exceptions from inside a destructor (if an exception propagates during stack unwinding, std::terminate() is called immediately).",
      "Deleting non-virtual base pointers (leads to base-only destructor execution and derived memory leak)."
    ],
    examPointers: [
      "University 5-Mark: Trace the construction and destruction sequence for a given multi-level inheritance program.",
      "What is RAII (Resource Acquisition Is Initialization)? How do destructors power RAII?"
    ]
  },
  {
    id: "this-static-friend",
    unit: 2,
    title: "this Pointer, Static Members & Friend Functions",
    tag: "Language Features",
    difficulty: "Intermediate",
    definition: "The 'this' pointer is an implicit const pointer passed to non-static member functions pointing to the invoking object. Static members belong to the class rather than individual instances. A friend function or friend class has access to private and protected members without being a member itself.",
    syntax: `class Complex {
    double real, imag;
    static int objectCount; // Shared class variable
public:
    Complex& setReal(double r) { this->real = r; return *this; } // Method chaining
    static int getCount(); // Static member function
    friend void displaySecret(const Complex& c); // Friend declaration
};`,
    exampleCode: `#include <iostream>

class Engine; // Forward declaration

class Car {
private:
    std::string model;
    int horsepower;
    static int totalCarsCreated; // Class-level shared variable

public:
    Car(std::string model, int horsepower) {
        this->model = model;          // Resolving name shadowing using 'this'
        this->horsepower = horsepower;
        totalCarsCreated++;
    }

    // Returning *this enables fluent method chaining
    Car& upgradeHorsepower(int extraHP) {
        this->horsepower += extraHP;
        return *this;
    }

    static int getTotalCars() {
        // Can only access static members; 'this' pointer does NOT exist here
        return totalCarsCreated;
    }

    // Grant external function special friend access to private attributes
    friend void diagnosticScan(const Car& c);
};

// Initialize static data member outside the class in global scope
int Car::totalCarsCreated = 0;

void diagnosticScan(const Car& c) {
    std::cout << "[Diagnostic Friend] Model: " << c.model 
              << " | Horsepower: " << c.horsepower << " HP\\n";
}

int main() {
    Car c1("Tesla Plaid", 1020);
    Car c2("Porsche Taycan", 750);

    c2.upgradeHorsepower(50).upgradeHorsepower(20); // Method chaining via *this

    diagnosticScan(c2);
    std::cout << "Total Cars Manufactured: " << Car::getTotalCars() << std::endl;
    return 0;
}`,
    expectedOutput: `[Diagnostic Friend] Model: Porsche Taycan | Horsepower: 820 HP
Total Cars Manufactured: 2`,
    explanation: [
      "The 'this' pointer disambiguates between member variables and parameter names with identical identifiers (this->model = model).",
      "Returning '*this' by reference allows cascading method invocations like c2.upgradeHorsepower(50).upgradeHorsepower(20).",
      "Static variables exist only once in static/global memory, shared across all instances. They must be defined outside class body.",
      "Static member functions do not receive an implicit 'this' pointer and therefore cannot access non-static instance attributes directly.",
      "Friendship is not mutual (if A is friend of B, B is not automatically friend of A) and friendship is not inherited."
    ],
    analogy: "Static member is like the Wi-Fi router in an engineering hostel room shared by all roommates. A friend function is like an authorized college repair technician given special key access inside the private dormitory.",
    commonMistakes: [
      "Attempting to use 'this' inside a static member function (compilation error: 'this' is only valid in non-static member functions).",
      "Declaring static variable inside class without defining it in global scope (causes unresolved external symbol linker error).",
      "Assuming friendship is inherited by child classes."
    ],
    examPointers: [
      "University 2-Mark: What is the type of 'this' pointer inside a const member function? (const ClassName* const).",
      "University 5-Mark: Explain the properties of Friend Functions and Friend Classes with safety considerations."
    ]
  },
  {
    id: "inheritance-types-modes",
    unit: 2,
    title: "Inheritance Types & Visibility Modes",
    tag: "Inheritance",
    difficulty: "Intermediate",
    definition: "Inheritance is the mechanism by which a new class (derived/subclass) acquires attributes and behaviors from an existing class (base/superclass), promoting code reuse and establishing an 'is-a' relationship.",
    syntax: `class Base {
public: int x;
protected: int y;
private: int z;
};

class DerivedPublic : public Base { /* x is public, y is protected, z is inaccessible */ };
class DerivedProtected : protected Base { /* x and y become protected */ };
class DerivedPrivate : private Base { /* x and y become private */ };`,
    exampleCode: `#include <iostream>
#include <string>

// Base Class
class ElectronicDevice {
protected:
    std::string brand;
    float powerRatingWatts;

public:
    ElectronicDevice(std::string b, float p) : brand(b), powerRatingWatts(p) {}
    
    void showSpecs() const {
        std::cout << "Brand: " << brand << " | Power: " << powerRatingWatts << "W\\n";
    }
};

// Derived Class (Public Inheritance)
class Laptop : public ElectronicDevice {
private:
    int ramGB;
    int storageSSD;

public:
    Laptop(std::string b, float p, int ram, int ssd) 
        : ElectronicDevice(b, p), ramGB(ram), storageSSD(ssd) {}

    void displayLaptopSpecs() const {
        showSpecs(); // Accessible because it's public in base
        std::cout << "Config: " << ramGB << "GB RAM, " << storageSSD << "GB SSD\\n";
    }
};

int main() {
    Laptop myMac("Apple M3", 70.0f, 18, 512);
    myMac.displayLaptopSpecs();
    return 0;
}`,
    expectedOutput: `Brand: Apple M3 | Power: 70W
Config: 18GB RAM, 512GB SSD`,
    explanation: [
      "Five types of inheritance in C++: Single (A->B), Multilevel (A->B->C), Multiple (A,B->C), Hierarchical (A->B, A->C), and Hybrid (combination).",
      "Public inheritance maintains public as public and protected as protected in the derived class (models true IS-A).",
      "Protected inheritance makes base public and protected members 'protected' in derived.",
      "Private inheritance (default for classes) makes all base public and protected members 'private' in derived.",
      "Private members of the base class are NEVER accessible directly in any derived class under any visibility mode."
    ],
    analogy: "Single inheritance is parent to child inheriting eye color. Multiple inheritance is a smartphone inheriting traits from both a camera and a cellular transmitter.",
    commonMistakes: [
      "Thinking private base members become protected or public: private members are permanently inaccessible to derived classes.",
      "Forgetting to call base class constructor in derived initializer list when base class lacks a parameterless default constructor."
    ],
    examPointers: [
      "University 5-Mark: Draw and explain the Visibility Mode Table comparing public, protected, and private derivation.",
      "Explain with syntax how derived class invokes parameterized base constructors."
    ]
  },
  {
    id: "diamond-virtual-base",
    unit: 2,
    title: "Diamond Problem & Virtual Base Classes",
    tag: "Inheritance",
    difficulty: "Advanced",
    definition: "The Diamond Problem occurs in hybrid/multipath inheritance when a derived class inherits from two intermediate classes that both inherit from the same top base class, creating ambiguity and redundant duplicate copies of the base class. A 'virtual base class' resolves this by ensuring only one shared instance of the top base class exists.",
    syntax: `class PoweredDevice { public: int powerState; };
class Scanner : virtual public PoweredDevice { }; // virtual inheritance
class Printer : virtual public PoweredDevice { }; // virtual inheritance
class Copier : public Scanner, public Printer { }; // Exactly ONE shared PoweredDevice`,
    exampleCode: `#include <iostream>

class GrandParent {
public:
    int geneticID;
    GrandParent(int id = 42) : geneticID(id) {
        std::cout << "GrandParent constructed with ID: " << geneticID << "\\n";
    }
};

// Virtual base class eliminates duplicated copies
class ParentA : virtual public GrandParent {
public:
    ParentA() { std::cout << "ParentA constructed\\n"; }
};

class ParentB : virtual public GrandParent {
public:
    ParentB() { std::cout << "ParentB constructed\\n"; }
};

class Child : public ParentA, public ParentB {
public:
    // In virtual inheritance, the most-derived class is responsible for initializing the virtual base
    Child(int id) : GrandParent(id), ParentA(), ParentB() {
        std::cout << "Child constructed\\n";
    }

    void testAccess() {
        // Without 'virtual', child.geneticID would trigger compiler error: 'request for member is ambiguous'
        std::cout << "Unambiguous Genetic ID = " << geneticID << std::endl;
    }
};

int main() {
    Child c(999);
    c.testAccess();
    return 0;
}`,
    expectedOutput: `GrandParent constructed with ID: 999
ParentA constructed
ParentB constructed
Child constructed
Unambiguous Genetic ID = 999`,
    explanation: [
      "Without 'virtual', class Copier inherits one PoweredDevice via Scanner and another PoweredDevice via Printer. Size doubles and accessing members causes compile ambiguity error.",
      "By specifying 'virtual public GrandParent', the compiler introduces an offset or virtual base table pointer (vbptr), ensuring only ONE canonical copy of GrandParent exists in memory.",
      "Crucial Rule: The most-derived class (Child) directly invokes the constructor of the virtual base class, bypassing intermediate parents."
    ],
    analogy: "If a company has a Founder, and two Co-Directors both hand the Intern identical employee ID cards from the same Founder, the Intern gets confused which card to swipe. Virtual inheritance ensures the Intern receives only ONE master ID badge directly from the Founder.",
    commonMistakes: [
      "Failing to make inheritance virtual in BOTH intermediate classes (if only one has virtual, ambiguity still remains).",
      "Expecting ParentA's constructor call to initialize GrandParent in the presence of Child."
    ],
    examPointers: [
      "University 10-Mark: What is the Diamond Problem in C++? Illustrate with a class diagram, explain compiler ambiguity, and demonstrate how Virtual Base Class solves it with complete code.",
      "Explain the runtime memory layout overhead introduced by vbptr in virtual inheritance."
    ]
  },
  {
    id: "polymorphism-virtual-functions",
    unit: 3,
    title: "Polymorphism, Virtual Functions & VTable Internals",
    tag: "Polymorphism",
    difficulty: "Advanced",
    definition: "Polymorphism ('many forms') enables treating derived objects through base class pointers or references. Compile-time polymorphism is achieved via overloading; runtime polymorphism is achieved through virtual functions, dynamic dispatch, and the virtual method table (vtable).",
    syntax: `class Base {
public:
    virtual void show() { std::cout << "Base\\n"; } // Dynamic dispatch
    virtual ~Base() = default; // Essential virtual destructor
};
class Derived : public Base {
public:
    void show() override { std::cout << "Derived\\n"; }
};`,
    exampleCode: `#include <iostream>
#include <vector>
#include <memory>

class Shape {
public:
    // Virtual function enables dynamic binding at runtime
    virtual void draw() const {
        std::cout << "Drawing generic shape\\n";
    }

    virtual double calculateArea() const = 0; // Pure virtual function -> Abstract Class

    virtual ~Shape() {
        std::cout << "Shape base destructor\\n";
    }
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}

    void draw() const override {
        std::cout << "Drawing a Circle with radius " << radius << "\\n";
    }

    double calculateArea() const override {
        return 3.14159 * radius * radius;
    }

    ~Circle() override {
        std::cout << "Circle derived destructor\\n";
    }
};

class Rectangle : public Shape {
private:
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}

    void draw() const override {
        std::cout << "Drawing a Rectangle (" << width << " x " << height << ")\\n";
    }

    double calculateArea() const override {
        return width * height;
    }

    ~Rectangle() override {
        std::cout << "Rectangle derived destructor\\n";
    }
};

int main() {
    // Polymorphic collection using Base pointers
    std::vector<std::unique_ptr<Shape>> canvas;
    canvas.push_back(std::make_unique<Circle>(5.0));
    canvas.push_back(std::make_unique<Rectangle>(4.0, 6.0));

    for (const auto& shape : canvas) {
        shape->draw(); // Dynamically bound via vtable
        std::cout << "Area = " << shape->calculateArea() << "\\n";
    }
    return 0;
}`,
    expectedOutput: `Drawing a Circle with radius 5
Area = 78.5397
Drawing a Rectangle (4 x 6)
Area = 24
Circle derived destructor
Shape base destructor
Rectangle derived destructor
Shape base destructor`,
    explanation: [
      "Every class containing at least one virtual function has a hidden compiler-generated array of function pointers called the Virtual Table (VTable).",
      "Each object of that class contains an invisible pointer (vptr) pointing to its class's VTable, typically taking 8 bytes (on 64-bit architecture).",
      "When shape->draw() is invoked, the CPU dereferences vptr, looks up the function pointer slot for draw(), and branches to the Derived override.",
      "Pure virtual function (= 0) makes the class Abstract: it cannot be instantiated directly and forces derived classes to implement it.",
      "The 'override' specifier (C++11) ensures compile-time validation that the signature matches the base virtual declaration."
    ],
    analogy: "A TV universal remote: The remote button says 'Power'. If you aim it at a Sony TV, it invokes Sony's power receiver; if you aim it at Samsung, it invokes Samsung's power receiver. The base pointer is the universal remote.",
    commonMistakes: [
      "Omitting the virtual destructor in a polymorphic base class: deleting derived objects via base pointer leads to undefined behavior and leaks derived memory.",
      "Object Slicing: passing an object by value instead of pointer/reference (Shape s = myCircle slices away Circle's extra attributes and strips vptr to Base!)."
    ],
    examPointers: [
      "University 10-Mark: Explain the internal working of VTable and VPtr with a neat memory sketch showing how runtime polymorphism is resolved.",
      "What is Object Slicing? Write a program showing how passing by value causes slicing and how references prevent it."
    ]
  },
  {
    id: "operator-overloading",
    unit: 3,
    title: "Operator Overloading: Unary, Binary & Stream",
    tag: "Polymorphism",
    difficulty: "Intermediate",
    definition: "Operator overloading allows programmers to redefine how existing C++ operators (+, -, *, ==, <<, >>, [], etc.) behave when applied to user-defined objects, making syntax natural and intuitive.",
    syntax: `// Member operator
ReturnType operator+(const ClassName& rhs) const;

// Non-member friend stream operators
friend std::ostream& operator<<(std::ostream& os, const ClassName& obj);
friend std::istream& operator>>(std::istream& is, ClassName& obj);`,
    exampleCode: `#include <iostream>

class Complex {
private:
    double real, imag;

public:
    Complex(double r = 0.0, double i = 0.0) : real(r), imag(i) {}

    // 1. Binary + operator as member function
    Complex operator+(const Complex& rhs) const {
        return Complex(this->real + rhs.real, this->imag + rhs.imag);
    }

    // 2. Unary - operator (negation)
    Complex operator-() const {
        return Complex(-this->real, -this->imag);
    }

    // 3. Equality operator ==
    bool operator==(const Complex& rhs) const {
        return (this->real == rhs.real) && (this->imag == rhs.imag);
    }

    // 4. Overloading stream insertion << as friend non-member function
    friend std::ostream& operator<<(std::ostream& os, const Complex& c) {
        os << c.real << (c.imag >= 0 ? " + " : " - ") << std::abs(c.imag) << "i";
        return os;
    }
};

int main() {
    Complex c1(3.5, 4.2);
    Complex c2(1.5, -2.2);

    Complex c3 = c1 + c2; // Translated to c1.operator+(c2)
    Complex c4 = -c1;     // Translated to c1.operator-()

    std::cout << "c1 = " << c1 << std::endl;
    std::cout << "c2 = " << c2 << std::endl;
    std::cout << "c1 + c2 = " << c3 << std::endl;
    std::cout << "-c1 = " << c4 << std::endl;
    return 0;
}`,
    expectedOutput: `c1 = 3.5 + 4.2i
c2 = 1.5 - 2.2i
c1 + c2 = 5 + 2i
-c1 = -3.5 - 4.2i`,
    explanation: [
      "Operators are simply syntactic sugar for function calls. c1 + c2 becomes c1.operator+(c2).",
      "Stream insertion (<<) and extraction (>>) CANNOT be member functions of your class because the left-hand operand is std::ostream/std::istream, not your object. Hence they are implemented as non-member friend functions.",
      "Operators that CANNOT be overloaded in C++: Scope resolution (::), Member access (.), Pointer-to-member (.*), Ternary (?:), and sizeof.",
      "You cannot invent new operators (like ** or ^^^), change operator precedence, or alter number of operands."
    ],
    analogy: "In math, '+' works on integers and real numbers. By overloading '+', we teach C++ how to naturally add matrices, vectors, or complex numbers just like native data types.",
    commonMistakes: [
      "Trying to overload :: or sizeof (illegal in C++).",
      "Declaring operator<< as a member function instead of friend/free function.",
      "Returning stream object by value instead of reference (std::ostream cannot be copied; must return std::ostream&)."
    ],
    examPointers: [
      "University 2-Mark: List 4 C++ operators that cannot be overloaded.",
      "University 5-Mark: Write a C++ program to overload << and >> operators for a user-defined Matrix or Time class."
    ]
  },
  {
    id: "raii-smart-pointers",
    unit: 4,
    title: "Dynamic Memory, RAII & Modern Smart Pointers",
    tag: "Memory & Modern C++",
    difficulty: "Advanced",
    definition: "RAII (Resource Acquisition Is Initialization) is a core C++ idiom binding the lifecycle of resources (heap memory, mutexes, file descriptors) to the lifetime of stack objects. Smart pointers (std::unique_ptr, std::shared_ptr, std::weak_ptr) eliminate manual delete and memory leaks.",
    syntax: `// Exclusive ownership (zero runtime overhead)
std::unique_ptr<T> p1 = std::make_unique<T>(args);

// Shared reference-counted ownership
std::shared_ptr<T> p2 = std::make_shared<T>(args);

// Non-owning observer to break cyclical reference leaks
std::weak_ptr<T> p3 = p2;`,
    exampleCode: `#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Resource acquired & allocated\\n"; }
    ~Resource() { std::cout << "Resource safely released (Zero Leaks!)\\n"; }
    void doWork() const { std::cout << "Executing mission-critical processing\\n"; }
};

void demoUniquePtr() {
    std::cout << "--- 1. std::unique_ptr Demo ---\\n";
    // Exclusive ownership: no two unique_ptr can hold same raw pointer
    std::unique_ptr<Resource> u1 = std::make_unique<Resource>();
    u1->doWork();
    // std::unique_ptr<Resource> u2 = u1; // COMPILE ERROR: Copying is disabled
    std::unique_ptr<Resource> u2 = std::move(u1); // Ownership transferred!
    std::cout << "Ownership transferred to u2\\n";
} // u2 goes out of scope here -> automatically deletes Resource!

void demoSharedWeakPtr() {
    std::cout << "\\n--- 2. std::shared_ptr & weak_ptr Demo ---\\n";
    std::shared_ptr<Resource> s1 = std::make_shared<Resource>();
    {
        std::shared_ptr<Resource> s2 = s1; // Ref count increments to 2
        std::cout << "Active Owners (Use Count): " << s1.use_count() << "\\n";
        
        std::weak_ptr<Resource> w = s1; // Weak pointer does NOT increment ref count
        if (auto locked = w.lock()) {
            std::cout << "Weak pointer successfully locked; resource is alive\\n";
        }
    } // s2 destroyed; ref count drops to 1
    std::cout << "Use Count after inner block: " << s1.use_count() << "\\n";
} // s1 destroyed; ref count drops to 0 -> Resource deallocated!

int main() {
    demoUniquePtr();
    demoSharedWeakPtr();
    return 0;
}`,
    expectedOutput: `--- 1. std::unique_ptr Demo ---
Resource acquired & allocated
Executing mission-critical processing
Ownership transferred to u2
Resource safely released (Zero Leaks!)

--- 2. std::shared_ptr & weak_ptr Demo ---
Resource acquired & allocated
Active Owners (Use Count): 2
Weak pointer successfully locked; resource is alive
Use Count after inner block: 1
Resource safely released (Zero Leaks!)`,
    explanation: [
      "Manual 'new' and 'delete' are error-prone: if an exception throws before delete, memory leaks permanently.",
      "std::unique_ptr has ZERO runtime overhead compared to a raw pointer. It disables copy constructor and implements move semantics.",
      "std::shared_ptr uses an atomic control block tracking reference count. When ref count hits 0, it deletes the object.",
      "std::weak_ptr prevents Circular Reference Deadlocks (where A owns shared_ptr to B and B owns shared_ptr to A, so ref count never reaches 0)."
    ],
    analogy: "unique_ptr is your passport (only one person can hold it). shared_ptr is a shared Spotify account (lives until the last family member leaves). weak_ptr is a window into the room showing if someone is inside without claiming a chair.",
    commonMistakes: [
      "Using new and delete when modern C++ smart pointers (make_unique/make_shared) are available.",
      "Creating circular references with two shared_ptrs, preventing deallocation (always break cycle with weak_ptr).",
      "Calling get() on unique_ptr and manually calling delete on the raw pointer."
    ],
    examPointers: [
      "University 5-Mark: Compare std::unique_ptr vs std::shared_ptr vs std::weak_ptr in modern C++ with reference counts.",
      "What is a circular reference memory leak and how does std::weak_ptr resolve it?"
    ]
  },
  {
    id: "templates-stl",
    unit: 4,
    title: "Templates, Generic Programming & STL",
    tag: "Generic Programming",
    difficulty: "Advanced",
    definition: "Templates empower Generic Programming by enabling functions and classes to operate on generic types without duplicating code. The compiler generates concrete type-specific implementations at compile time.",
    syntax: `// Function Template
template <typename T>
T findMax(T a, T b) { return (a > b) ? a : b; }

// Class Template
template <typename T, size_t Capacity = 10>
class Stack {
    T arr[Capacity];
    int top = -1;
public:
    void push(const T& item);
    T pop();
};`,
    exampleCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

// Generic Function Template
template <typename T>
T findMaximum(T a, T b) {
    return (a > b) ? a : b;
}

// Generic Class Template
template <typename T>
class Pair {
private:
    T firstVal, secondVal;
public:
    Pair(T a, T b) : firstVal(a), secondVal(b) {}
    void print() const {
        std::cout << "(" << firstVal << ", " << secondVal << ")\\n";
    }
};

int main() {
    // Compiler automatically instantiates findMaximum<int> and findMaximum<double>
    std::cout << "Max int: " << findMaximum(42, 99) << "\\n";
    std::cout << "Max double: " << findMaximum(3.1415, 2.7182) << "\\n";
    std::cout << "Max string: " << findMaximum(std::string("CS"), std::string("AI")) << "\\n";

    Pair<int> intPair(10, 20);
    Pair<std::string> strPair("C++", "Python");
    intPair.print();
    strPair.print();

    // Standard Template Library (STL) Vector & Algorithm demo
    std::vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};
    std::sort(numbers.begin(), numbers.end());
    std::cout << "Sorted STL Vector: ";
    for (int n : numbers) std::cout << n << " ";
    std::cout << std::endl;
    return 0;
}`,
    expectedOutput: `Max int: 99
Max double: 3.1415
Max string: CS
(10, 20)
(C++, Python)
Sorted STL Vector: 11 12 22 25 34 64 90`,
    explanation: [
      "Templates are instantiated by the compiler at compile time based on argument types (Monomorphization), achieving zero runtime overhead.",
      "STL (Standard Template Library) is built on 4 pillars: Containers (vector, list, map), Algorithms (sort, find, transform), Iterators, and Functors/Lambdas.",
      "Template specialization allows customizing behavior for specific edge types (e.g., template <> class Stack<bool> to optimize bitwise storage)."
    ],
    analogy: "A rubber stamp with a blank date slot: you insert the date number once, and it prints clear stamps for that date. The template is the stamp machine; concrete classes are the stamped pages.",
    commonMistakes: [
      "Defining template implementation in .cpp file and declaring in .h without explicit instantiation (leads to linker unresolved symbol error).",
      "Using operators in template body that the argument type does not support (e.g. using '>' on a custom struct without operator> overloaded)."
    ],
    examPointers: [
      "University 5-Mark: Explain the components of STL with neat diagrams of Containers, Iterators, and Algorithms.",
      "What is Template Specialization? Differentiate between Function Template and Class Template."
    ]
  },
  {
    id: "solid-principles",
    unit: 4,
    title: "SOLID Principles in C++ & Real-World OOP Design",
    tag: "Software Engineering",
    difficulty: "Advanced",
    definition: "SOLID is an acronym for 5 foundational software engineering design principles coined by Robert C. Martin: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
    syntax: `// S: Single Responsibility (Class has one reason to change)
// O: Open for extension, Closed for modification (Use abstract interfaces)
// L: Subtypes must be substitutable for their base types without breaking code
// I: Clients should not depend on interfaces they do not use
// D: High-level modules should depend on abstractions, not concrete details`,
    exampleCode: `#include <iostream>
#include <memory>
#include <string>

// Dependency Inversion & Open/Closed Principle
// Abstract notification channel interface
class IMessageService {
public:
    virtual void sendMessage(const std::string& recipient, const std::string& msg) = 0;
    virtual ~IMessageService() = default;
};

// Concrete implementations
class EmailService : public IMessageService {
public:
    void sendMessage(const std::string& recipient, const std::string& msg) override {
        std::cout << "[Email -> " << recipient << "]: " << msg << "\\n";
    }
};

class SMSService : public IMessageService {
public:
    void sendMessage(const std::string& recipient, const std::string& msg) override {
        std::cout << "[SMS -> " << recipient << "]: " << msg << "\\n";
    }
};

// High-level client depends on abstraction (IMessageService), not concrete EmailService
class UserNotificationManager {
private:
    std::shared_ptr<IMessageService> service;

public:
    UserNotificationManager(std::shared_ptr<IMessageService> svc) : service(svc) {}

    void alertStudent(const std::string& studentId, const std::string& alert) {
        service->sendMessage(studentId, alert);
    }
};

int main() {
    auto email = std::make_shared<EmailService>();
    auto sms = std::make_shared<SMSService>();

    UserNotificationManager manager1(email);
    manager1.alertStudent("CS-2024-88", "OOP Practicals Submission Deadline: 5 PM");

    UserNotificationManager manager2(sms);
    manager2.alertStudent("+91-9876543210", "Viva Voce Slot confirmed: 10:30 AM");
    return 0;
}`,
    expectedOutput: `[Email -> CS-2024-88]: OOP Practicals Submission Deadline: 5 PM
[SMS -> +91-9876543210]: Viva Voce Slot confirmed: 10:30 AM`,
    explanation: [
      "Open/Closed: We can add WhatsAppService without touching a single line of UserNotificationManager code.",
      "Liskov Substitution: Any IMessageService subclass can seamlessly replace another without unexpected side effects.",
      "Dependency Inversion: UserNotificationManager takes IMessageService via dependency injection rather than hardcoding 'new EmailService()'."
    ],
    analogy: "A universal USB-C port: your laptop doesn't care whether you plug in a mouse, keyboard, monitor, or charger, as long as it adheres to the standard USB-C protocol interface.",
    commonMistakes: [
      "Violating Liskov Substitution by throwing 'NotImplementedException' inside derived virtual overrides.",
      "God Classes that handle UI, database, calculation, and networking in one huge monolithic class (violates Single Responsibility)."
    ],
    examPointers: [
      "University 10-Mark: Explain all 5 SOLID principles with practical C++ design snippets.",
      "Explain the Dependency Inversion Principle and how pure virtual interfaces enable it."
    ]
  }
];
