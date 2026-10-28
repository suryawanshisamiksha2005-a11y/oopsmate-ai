export interface QuizQuestion {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the size of an empty class in C++ on a 64-bit architecture?",
    options: ["0 bytes", "1 byte", "4 bytes", "8 bytes"],
    correctIndex: 1,
    explanation: "In C++, an empty class has a non-zero size (typically 1 byte) to ensure that two distinct object instances have unique, distinct memory addresses in the address space.",
    difficulty: "Easy",
    topic: "Classes & Objects"
  },
  {
    id: 2,
    question: "What is the output of the following C++ code?",
    codeSnippet: `class Base {
public:
    Base() { std::cout << "B"; }
    ~Base() { std::cout << "~B"; }
};
class Derived : public Base {
public:
    Derived() { std::cout << "D"; }
    ~Derived() { std::cout << "~D"; }
};
int main() {
    Derived obj;
    return 0;
}`,
    options: ["BD~D~B", "DB~B~D", "BD~B~D", "DB~D~B"],
    correctIndex: 0,
    explanation: "Base constructors execute before derived constructors (B then D). Destructors execute in reverse order (derived first, then base: ~D then ~B). Thus, the complete trace is BD~D~B.",
    difficulty: "Medium",
    topic: "Object Lifecycle"
  },
  {
    id: 3,
    question: "Why must the parameter of a Copy Constructor be passed by reference (const T&) rather than by value (T)?",
    options: [
      "To save heap memory",
      "Because passing by value would invoke the copy constructor recursively, causing an infinite loop",
      "C++ does not allow objects to be passed by value to any function",
      "To enable move semantics"
    ],
    correctIndex: 1,
    explanation: "If an object were passed by value to the copy constructor, a copy of the argument would have to be created, which would invoke the copy constructor again, leading to infinite compile-time/runtime recursion.",
    difficulty: "Medium",
    topic: "Constructors"
  },
  {
    id: 4,
    question: "What happens if a base class pointer deletes a derived class object when the base destructor is NOT virtual?",
    options: [
      "Both base and derived destructors are called safely",
      "Only the derived destructor is called",
      "Undefined behavior occurs and derived class destructor is not called, leading to resource/memory leaks",
      "The program refuses to compile"
    ],
    correctIndex: 2,
    explanation: "Without a virtual destructor in the base class, delete ptr resolves statically via the pointer type (Base), so only Base's destructor is executed. Derived attributes remain un-freed, resulting in undefined behavior and memory leaks.",
    difficulty: "Hard",
    topic: "Polymorphism"
  },
  {
    id: 5,
    question: "Which of the following operators CANNOT be overloaded in C++?",
    options: [
      "+, -, *, /",
      "[], (), ->, =",
      "::, ., .*, ?:, sizeof",
      "<<, >>, ++, --"
    ],
    correctIndex: 2,
    explanation: "The C++ standard strictly prohibits overloading the scope resolution operator (::), member access (.), pointer-to-member (.*), ternary conditional (?:), and the sizeof operator.",
    difficulty: "Easy",
    topic: "Operator Overloading"
  },
  {
    id: 6,
    question: "What problem does virtual inheritance solve in the Diamond Inheritance pattern?",
    options: [
      "Slow compilation times",
      "Duplicate subobjects and member ambiguity of the topmost base class",
      "Inability to use private access specifiers",
      "Circular dependency between header files"
    ],
    correctIndex: 1,
    explanation: "In diamond inheritance, virtual inheritance ensures that the most-derived class retains only one shared canonical instance of the top base class, eliminating ambiguity and duplicate memory allocation.",
    difficulty: "Medium",
    topic: "Inheritance"
  },
  {
    id: 7,
    question: "What is the type of the implicit 'this' pointer inside a const member function of class Sample?",
    options: [
      "Sample*",
      "const Sample*",
      "const Sample* const",
      "Sample* const"
    ],
    correctIndex: 2,
    explanation: "Inside a non-const member function, 'this' is 'Sample* const' (cannot point to another object). Inside a const member function, 'this' is 'const Sample* const' (cannot change where it points, and cannot modify member variables).",
    difficulty: "Hard",
    topic: "this Pointer"
  },
  {
    id: 8,
    question: "What is the output of this code snippet demonstrating Object Slicing?",
    codeSnippet: `class Base {
public:
    virtual void print() { std::cout << "Base "; }
};
class Derived : public Base {
public:
    void print() override { std::cout << "Derived "; }
};
void show(Base b) {
    b.print();
}
int main() {
    Derived d;
    show(d);
    return 0;
}`,
    options: ["Derived", "Base", "Base Derived", "Compilation Error"],
    correctIndex: 1,
    explanation: "Function show(Base b) accepts by value. When Derived object 'd' is passed, the Derived portion is sliced off, copy-constructing a pure Base object. Dynamic dispatch is lost, printing 'Base '.",
    difficulty: "Hard",
    topic: "Polymorphism"
  },
  {
    id: 9,
    question: "Which smart pointer should be used to model non-owning observers and break cyclic reference memory leaks?",
    options: ["std::unique_ptr", "std::shared_ptr", "std::weak_ptr", "std::auto_ptr"],
    correctIndex: 2,
    explanation: "std::weak_ptr holds a non-owning reference to an object managed by std::shared_ptr without incrementing the reference count, safely breaking cyclical dependency deadlocks.",
    difficulty: "Medium",
    topic: "Memory & Smart Pointers"
  },
  {
    id: 10,
    question: "What makes a C++ class an Abstract Class?",
    options: [
      "Having a private constructor",
      "Declaring all members static",
      "Containing at least one Pure Virtual Function (= 0)",
      "Inheriting from more than 3 classes"
    ],
    correctIndex: 2,
    explanation: "A class containing at least one pure virtual function (virtual void fn() = 0;) becomes abstract and cannot be directly instantiated.",
    difficulty: "Easy",
    topic: "Polymorphism"
  },
  {
    id: 11,
    question: "What is the relationship between Friendship and Inheritance in C++?",
    options: [
      "Friendship is automatically inherited by all derived classes",
      "Friendship is neither inherited nor transitive",
      "Friendship is inherited only in public inheritance",
      "Friendship is transitive: friends of friends are friends"
    ],
    correctIndex: 1,
    explanation: "Friendship in C++ is not inherited (children of friends are not friends) and not transitive (a friend of a friend is not your friend).",
    difficulty: "Medium",
    topic: "Friend Functions"
  },
  {
    id: 12,
    question: "Which of the following is true regarding Static Member Functions in C++?",
    options: [
      "They have an implicit 'this' pointer",
      "They can directly access non-static data members",
      "They can only access static data members and static member functions directly",
      "They can be declared virtual"
    ],
    correctIndex: 2,
    explanation: "Static member functions are scoped to the class rather than instances. Because they have no 'this' pointer, they can only access other static members directly.",
    difficulty: "Medium",
    topic: "Static Members"
  },
  {
    id: 13,
    question: "What is the difference between Function Overloading and Function Overriding?",
    options: [
      "Overloading occurs at runtime; Overriding occurs at compile-time",
      "Overloading is in the same scope with different parameters; Overriding is in derived class with exact same signature and virtual in base",
      "Overloading requires virtual keyword; Overriding does not",
      "They are identical terms in modern C++"
    ],
    correctIndex: 1,
    explanation: "Function Overloading is compile-time polymorphism (same function name, different parameter signatures in same scope). Overriding is runtime polymorphism where derived class redefines a base virtual function with identical signature.",
    difficulty: "Easy",
    topic: "Polymorphism"
  },
  {
    id: 14,
    question: "What is the memory size overhead of a Virtual Method Table Pointer (vptr) in an object on a 64-bit architecture?",
    options: ["0 bytes (compiled away)", "4 bytes", "8 bytes", "16 bytes"],
    correctIndex: 2,
    explanation: "On a 64-bit architecture, pointers are 8 bytes in length. Hence, each object instance of a class with virtual functions carries an 8-byte vptr pointing to the class vtable.",
    difficulty: "Medium",
    topic: "Polymorphism"
  },
  {
    id: 15,
    question: "Consider: Derived d; Base* b = &d; b->func(); When is dynamic binding invoked?",
    options: [
      "Always, whenever a pointer is used",
      "Only if func() was declared with the 'virtual' keyword in the Base class",
      "Only if Derived uses public inheritance",
      "Only if main() returns 0"
    ],
    correctIndex: 1,
    explanation: "Dynamic binding (late binding) in C++ requires the member function to be declared 'virtual' in the Base class. Otherwise, static compile-time binding occurs based on pointer type (Base).",
    difficulty: "Easy",
    topic: "Polymorphism"
  },
  {
    id: 16,
    question: "What does RAII stand for in modern C++?",
    options: [
      "Runtime Allocation and Immediate Initialization",
      "Resource Acquisition Is Initialization",
      "Random Access Iterator Implementation",
      "Reference Assignment In Interfaces"
    ],
    correctIndex: 1,
    explanation: "RAII stands for Resource Acquisition Is Initialization. It couples the lifetime of resources (memory, sockets, mutexes) to the lifespan of automatic (stack) objects.",
    difficulty: "Easy",
    topic: "Modern C++"
  },
  {
    id: 17,
    question: "What is the output of the following C++ code?",
    codeSnippet: `#include <iostream>
class Test {
    static int x;
public:
    Test() { x++; }
    static int getX() { return x; }
};
int Test::x = 10;
int main() {
    Test t1, t2, t3;
    std::cout << Test::getX();
    return 0;
}`,
    options: ["10", "11", "13", "Compilation error"],
    correctIndex: 2,
    explanation: "Static member x starts at 10. Each of the three objects (t1, t2, t3) invokes the constructor which increments x: 10 -> 11 -> 12 -> 13. Test::getX() returns 13.",
    difficulty: "Easy",
    topic: "Static Members"
  },
  {
    id: 18,
    question: "Why should stream insertion operator (<<) be overloaded as a non-member friend function rather than a member function?",
    options: [
      "Because member operators are slower",
      "Because the left-hand operand is std::ostream, not an instance of our user-defined class",
      "Because std::ostream does not support polymorphism",
      "C++ forbids member functions from taking parameters"
    ],
    correctIndex: 1,
    explanation: "In std::cout << myObj, the left operand is std::cout (std::ostream). If it were a member function, it would have to be defined inside std::ostream, which we cannot modify. Therefore, it is defined as a non-member friend function.",
    difficulty: "Medium",
    topic: "Operator Overloading"
  },
  {
    id: 19,
    question: "What does the C++11 'override' specifier do when added to a member function declaration?",
    options: [
      "Makes the function virtual automatically",
      "Forces the compiler to verify that the function actually overrides a virtual function in a base class, throwing a compilation error if not",
      "Increases the execution speed of the function",
      "Prevents derived classes from further overriding the function"
    ],
    correctIndex: 1,
    explanation: "The 'override' keyword asks the compiler to check that a base class has an identical virtual signature. It catches subtle typo bugs like mismatched constness or parameter types.",
    difficulty: "Medium",
    topic: "Polymorphism"
  },
  {
    id: 20,
    question: "What is the primary difference between Aggregation and Composition?",
    options: [
      "Aggregation is an 'is-a' relationship; Composition is a 'has-a' relationship",
      "In Composition, the child cannot exist independently of the parent (strong ownership); in Aggregation, the child can exist independently (weak ownership)",
      "Aggregation requires templates; Composition requires inheritance",
      "There is no difference in C++"
    ],
    correctIndex: 1,
    explanation: "Composition is death-relationship: if the Car is destroyed, its Engine is destroyed. Aggregation is independent relationship: if a Department is closed, Professors still exist independently.",
    difficulty: "Medium",
    topic: "OOP Design"
  },
  {
    id: 21,
    question: "What is the output of this C++ program?",
    codeSnippet: `#include <iostream>
class A {
public:
    virtual void show(int x = 10) { std::cout << "A:" << x << " "; }
};
class B : public A {
public:
    void show(int x = 20) override { std::cout << "B:" << x << " "; }
};
int main() {
    A* p = new B();
    p->show();
    delete p;
    return 0;
}`,
    options: ["A:10 ", "B:20 ", "B:10 ", "Compilation error"],
    correctIndex: 2,
    explanation: "Default arguments are bound statically at compile time based on the pointer type (A has default 10). But the virtual function is dispatched dynamically at runtime (B's show). Thus, B's body runs with A's default argument 10 -> 'B:10 '!",
    difficulty: "Hard",
    topic: "Polymorphism"
  },
  {
    id: 22,
    question: "Under private inheritance, what happens to public and protected members of the base class?",
    options: [
      "They remain public and protected in the derived class",
      "They both become private members of the derived class",
      "They become inaccessible in the derived class",
      "Public becomes protected; protected becomes private"
    ],
    correctIndex: 1,
    explanation: "In private inheritance, all public and protected members of the base class become private members of the derived class.",
    difficulty: "Medium",
    topic: "Inheritance"
  },
  {
    id: 23,
    question: "Which of the following describes the Liskov Substitution Principle (LSP)?",
    options: [
      "A class should only have one reason to change",
      "Objects of a superclass should be replaceable with objects of its subclasses without breaking application correctness",
      "Software entities should be open for extension, but closed for modification",
      "High-level modules should depend on abstractions, not concretions"
    ],
    correctIndex: 1,
    explanation: "LSP states that any subclass must be substitutable for its parent class without altering the correctness or desirable properties of the program (e.g. avoiding the Square-Rectangle problem).",
    difficulty: "Medium",
    topic: "SOLID Principles"
  },
  {
    id: 24,
    question: "In C++, why can a constructor NOT be declared virtual?",
    options: [
      "Because constructors do not return a value",
      "Because an object's vtable pointer (vptr) is initialized during constructor execution, so virtual dispatch cannot exist before object creation completes",
      "Because C++ compilers cannot inline virtual functions",
      "It can be virtual if explicitly allowed by compiler flags"
    ],
    correctIndex: 1,
    explanation: "Virtual calls require a vptr pointing to a vtable. However, the vptr is set up by the constructor while constructing the object. Before construction starts, no vptr exists, making virtual constructors fundamentally impossible.",
    difficulty: "Hard",
    topic: "Object Lifecycle"
  },
  {
    id: 25,
    question: "What is the result of using 'std::move' on an object?",
    options: [
      "It deletes the original object from memory immediately",
      "It casts an lvalue to an rvalue reference (T&&), enabling move constructor or move assignment to pilfer resources",
      "It moves the object from stack to heap",
      "It generates a multithreaded copy in background"
    ],
    correctIndex: 1,
    explanation: "std::move does not move anything by itself; it performs an unconditional static_cast of an expression to an rvalue reference, signaling that the object's resources may be stolen.",
    difficulty: "Medium",
    topic: "Modern C++"
  },
  {
    id: 26,
    question: "What is the Rule of Zero in modern C++?",
    options: [
      "Never use pointers in code",
      "Classes that have custom resource management should define zero member functions",
      "Classes that do not manage resources directly should not define any of the special member functions (destructor, copy/move constructors, copy/move assignment)",
      "Set all pointers to 0 instead of nullptr"
    ],
    correctIndex: 2,
    explanation: "The Rule of Zero states that if a class uses standard RAII types (std::vector, std::string, std::unique_ptr), it should declare none of the 5 special member functions because defaults are automatically correct.",
    difficulty: "Hard",
    topic: "Modern C++"
  },
  {
    id: 27,
    question: "Which of the following statements about C++ Templates is true?",
    options: [
      "Templates incur heavy runtime performance penalties",
      "Template code is evaluated and expanded at compile-time via monomorphization, incurring zero runtime abstraction penalty",
      "Templates only work with primitive types like int and float",
      "Templates cannot take non-type parameters like integers"
    ],
    correctIndex: 1,
    explanation: "C++ templates are compile-time generic constructs. The compiler generates concrete machine code for each instantiated type (Monomorphization), achieving zero runtime overhead.",
    difficulty: "Medium",
    topic: "Templates"
  },
  {
    id: 28,
    question: "What does the 'noexcept' specifier signify on a Move Constructor?",
    options: [
      "The function can never be called",
      "Guarantees the function does not emit exceptions, allowing STL containers (like std::vector) to safely use move instead of copy during reallocation",
      "Forces compiler to catch all runtime errors silently",
      "Disables multithreading"
    ],
    correctIndex: 1,
    explanation: "std::vector will only use move constructors during reallocation if marked noexcept; otherwise, to maintain the strong exception guarantee, it falls back to slower deep copying.",
    difficulty: "Hard",
    topic: "Modern C++"
  },
  {
    id: 29,
    question: "What is the difference between 'delete' and 'delete[]' in C++?",
    options: [
      "They are interchangeable in modern C++",
      "'delete' is used for single objects allocated with 'new'; 'delete[]' is used for array allocations with 'new[]' to invoke destructors for every element",
      "'delete[]' only frees stack memory",
      "'delete' is faster than 'delete[]'"
    ],
    correctIndex: 1,
    explanation: "Calling 'delete' on an array allocated via 'new T[N]' results in undefined behavior because the compiler only calls the destructor of the first element, failing to destroy the remaining N-1 objects.",
    difficulty: "Easy",
    topic: "Dynamic Memory"
  },
  {
    id: 30,
    question: "What is 'const correctness' in C++ member functions?",
    options: [
      "Making every variable uppercase",
      "Specifying 'const' after a member function signature to guarantee that the function will not modify any data members of the invoking object",
      "Declaring the return type as const void",
      "Using const only in global functions"
    ],
    correctIndex: 1,
    explanation: "Marking a member function as 'void print() const' promises that the method does not mutate the object's state, allowing it to be safely invoked on const references and objects.",
    difficulty: "Easy",
    topic: "Classes & Objects"
  },
  {
    id: 31,
    question: "What is a 'Pure Virtual Destructor' and must it have a function body?",
    options: [
      "It cannot have a body; doing so causes compilation error",
      "It can be declared pure virtual in base class (virtual ~Base() = 0;), but MUST still have a function definition/body outside the class because derived destructors always chain to base destructors",
      "Pure virtual destructors are illegal in C++",
      "Only static classes can have pure virtual destructors"
    ],
    correctIndex: 1,
    explanation: "In C++, a pure virtual destructor is legal to make a class abstract, but because derived class destructors always implicitly call base destructors during destruction chaining, a definition must be provided!",
    difficulty: "Hard",
    topic: "Polymorphism"
  },
  {
    id: 32,
    question: "What does the Single Responsibility Principle (SRP) dictate?",
    options: [
      "A class should contain only a single method",
      "A class should have one, and only one, reason to change",
      "Only one engineer should work on a class",
      "A software application should have only one class"
    ],
    correctIndex: 1,
    explanation: "SRP states that a class should encapsulate only one single aspect of functionality and have only one actor/reason that could necessitate modifications to it.",
    difficulty: "Easy",
    topic: "SOLID Principles"
  }
];
