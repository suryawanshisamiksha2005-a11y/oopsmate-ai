export interface VivaQuestion {
  id: number;
  topic: string;
  question: string;
  examinerIntent: string;
  keyTechnicalTerms: string[];
  hint: string;
  idealAnswer: string;
}

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    topic: "Virtual Functions & VTable",
    question: "Explain what happens in memory when a virtual function is called through a base class pointer.",
    examinerIntent: "Tests whether student understands compiler internals, runtime dynamic dispatch, vptr, and vtable rather than just high-level definitions.",
    keyTechnicalTerms: ["vtable", "vptr", "function pointer", "indirection", "dynamic dispatch", "runtime overhead"],
    hint: "Mention the role of the invisible pointer stored inside the object and where it points during execution.",
    idealAnswer: "When a class contains virtual functions, the compiler generates a static array of function pointers called the VTable (Virtual Table). Each object of that class contains a hidden pointer called vptr pointing to this VTable. When invoking a virtual function via a base pointer, the CPU dereferences the object's vptr, indexes into the VTable at runtime to fetch the actual derived function address, and branches to it. This indirection provides dynamic polymorphism."
  },
  {
    id: 2,
    topic: "Object Lifecycle",
    question: "Why should a base class destructor always be declared virtual when using polymorphism?",
    examinerIntent: "Tests if student knows the classic memory leak and undefined behavior hazard when deleting derived objects via base pointers.",
    keyTechnicalTerms: ["virtual destructor", "undefined behavior", "memory leak", "static binding", "destruction chaining"],
    hint: "Think about what happens when you execute 'delete basePtr' where basePtr points to a derived object.",
    idealAnswer: "If a base class destructor is not virtual, calling 'delete basePtr' results in static compile-time binding based on the pointer type. As a result, only the base class destructor executes, while the derived class destructor is completely skipped. This leaves derived dynamic resources (heap buffers, open files) un-freed, resulting in serious memory leaks and undefined behavior. Declaring it virtual guarantees proper polymorphic destruction from derived up to base."
  },
  {
    id: 3,
    topic: "Constructors",
    question: "What is Object Slicing in C++, and how can you prevent it?",
    examinerIntent: "Tests student's grasp of value semantics vs reference semantics in inheritance.",
    keyTechnicalTerms: ["value passing", "slicing", "derived attributes stripped", "vptr reassigned", "pass by reference or pointer"],
    hint: "What happens when you pass a Derived object to a function taking Base by value?",
    idealAnswer: "Object slicing occurs when a derived class object is assigned or passed by value to a base class object. Because the base object only has enough memory storage for base members, the derived-specific member variables and vptr are literally 'sliced off'. The copy constructor of the base class is invoked, resetting the object to a pure base instance and destroying dynamic polymorphism. It is prevented by always passing polymorphic objects by const reference (const Base&) or by smart pointer."
  },
  {
    id: 4,
    topic: "Inheritance",
    question: "What is the Diamond Problem, and how does the compiler implement a Virtual Base Class under the hood?",
    examinerIntent: "Tests multi-path hybrid inheritance and knowledge of virtual base pointers (vbptr).",
    keyTechnicalTerms: ["multipath inheritance", "ambiguity", "duplicate subobject", "virtual base class", "vbptr", "offset"],
    hint: "Explain how two parents inheriting from GrandParent create duplicates, and how virtual public fixes it.",
    idealAnswer: "The Diamond Problem occurs in hybrid inheritance when two intermediate derived classes inherit from the same top base class, and a fourth class inherits from both intermediates. Without virtual inheritance, the final derived class receives two duplicate copies of the grandparent subobject, causing memory bloat and ambiguous member access. Declaring intermediate classes as 'virtual public' instructs the compiler to insert a virtual base pointer (vbptr) or offset table, ensuring only one canonical grandparent instance is shared across the hierarchy."
  },
  {
    id: 5,
    topic: "Memory Management & Modern C++",
    question: "Differentiate between std::unique_ptr, std::shared_ptr, and std::weak_ptr. When would you use each?",
    examinerIntent: "Checks modern C++ (C++11/17) RAII knowledge and understanding of reference counting.",
    keyTechnicalTerms: ["exclusive ownership", "reference count", "control block", "non-owning observer", "circular reference", "zero overhead"],
    hint: "Think about ownership semantics: exclusive vs shared vs observer.",
    idealAnswer: "std::unique_ptr enforces exclusive ownership of a resource with zero runtime memory overhead; it cannot be copied, only moved. std::shared_ptr provides shared ownership using an atomic reference count stored in a control block, freeing the resource when the count drops to zero. std::weak_ptr is a non-owning observer that points to a shared_ptr-managed object without incrementing the reference count, primarily used to break circular reference cycles that cause permanent memory leaks."
  },
  {
    id: 6,
    topic: "Core Principles",
    question: "Explain the difference between Encapsulation and Data Abstraction with a concrete example.",
    examinerIntent: "Checks foundational clarity. Many students confuse the two.",
    keyTechnicalTerms: ["bundling data and methods", "access specifiers", "hiding implementation", "essential features interface"],
    hint: "Encapsulation is the protective capsule; Abstraction is the dashboard/steering wheel.",
    idealAnswer: "Encapsulation is the mechanism of wrapping data and the methods that operate on that data into a single unit (class) while using access specifiers (private, protected) to hide internal state from unauthorized direct access. Abstraction is the design principle of exposing only essential features and high-level interfaces to the consumer while concealing internal complexity. For example, a car's accelerator pedal is an Abstraction (press to speed up); the internal combustion chamber and fuel-injection logic sealed inside the engine block represent Encapsulation."
  },
  {
    id: 7,
    topic: "Constructors & Copy Semantics",
    question: "What is the difference between a Shallow Copy and a Deep Copy? What error occurs if you shallow copy a class with raw pointers?",
    examinerIntent: "Tests copy constructor and heap management.",
    keyTechnicalTerms: ["shallow copy", "deep copy", "pointer address copy", "double free", "dangling pointer", "heap allocation"],
    hint: "Consider two objects pointing to the exact same dynamically allocated memory address when their destructors run.",
    idealAnswer: "A shallow copy copies only member variable values bit-by-bit. If the class holds a pointer to dynamically allocated heap memory, both the original and cloned object will point to the exact same memory address. When the objects go out of scope, both destructors will call 'delete' on that identical address, causing a catastrophic 'double free' runtime crash and leaving dangling pointers. A deep copy allocates a distinct new heap buffer and copies the actual underlying data, ensuring independent object lifecycles."
  },
  {
    id: 8,
    topic: "Operator Overloading",
    question: "Why can the scope resolution operator (::) and sizeof operator not be overloaded in C++?",
    examinerIntent: "Tests understanding of C++ language grammar, compile-time evaluation, and compiler design invariants.",
    keyTechnicalTerms: ["compile-time evaluation", "parsing grammar", "guaranteed invariants", "name resolution"],
    hint: "Consider how the compiler parses identifiers and calculates object layout sizes before running any code.",
    idealAnswer: "Operators like '::' (scope resolution), '.' (member access), and 'sizeof' cannot be overloaded because they are fundamental to C++ syntactic parsing and compile-time name resolution. 'sizeof' is evaluated by the compiler at compile time to calculate memory allocations and array bounds; allowing it to run arbitrary runtime user code would destroy C++'s type system and memory layout guarantees. Overloading '::' or '.' would also lead to catastrophic ambiguities in distinguishing member lookups from function invocations."
  },
  {
    id: 9,
    topic: "this Pointer",
    question: "Can a member function call 'delete this'? What are the rules and dangers?",
    examinerIntent: "Tests advanced object lifecycle and pointer handling.",
    keyTechnicalTerms: ["delete this", "heap allocated", "no subsequent member access", "undefined behavior"],
    hint: "Think about whether the object was created on the stack vs heap.",
    idealAnswer: "Yes, 'delete this' is legal in C++, but it is perilous and subject to strict conditions. The object MUST have been allocated dynamically with 'new' (calling delete this on a stack object causes an instant crash). Furthermore, once 'delete this' executes, the member function must not access ANY member variables, call any other member functions, or access 'this' ever again, and must immediately return. It is occasionally used in reference-counting or state machine patterns."
  },
  {
    id: 10,
    topic: "SOLID Principles",
    question: "Explain the Dependency Inversion Principle (DIP) and how C++ abstract base classes enable it.",
    examinerIntent: "Assesses student's software architecture maturity and transition from academic to professional C++.",
    keyTechnicalTerms: ["high-level modules", "low-level modules", "pure virtual interface", "loose coupling", "dependency injection"],
    hint: "Should high-level business logic depend on concrete database classes, or on an abstract interface?",
    idealAnswer: "The Dependency Inversion Principle states that high-level business modules should not depend on low-level concrete modules; both should depend on abstractions (interfaces). In C++, we implement this by declaring pure virtual abstract base classes (like IStorage or ILogger). High-level classes interact strictly through pointers or references to this pure virtual interface, allowing concrete implementations to be injected or swapped at runtime without modifying high-level business logic, resulting in loosely coupled, maintainable software."
  }
];
