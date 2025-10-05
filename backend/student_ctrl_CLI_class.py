class Student:
    def __init__(self, student_id, name, age):
        self.student_id = student_id
        self.name = name
        self.age = age

    def __repr__(self):
        return f"ID: {self.student_id}, Name: {self.name}, Age: {self.age}"
    
    def update_student(self, student_id, name=None, age=None):
        if self.student_id == student_id:
            if name:
                self.name = name
                print(f"Name updated to {self.name}")
            if age:
                self.age = age
                print(f"Age updated to {self.age}")
        else :
            return "Student not found."
        return self.__repr__()
    
class student_db:
    students = {}

    @classmethod
    def create_student(cls, student_id, name, age):
        if student_id in cls.students:
            return "Student ID already exists."
        cls.students[student_id] = Student(student_id, name, age)
        return f"Student {name} added."

    @classmethod
    def delete_student(cls, student_id):
        if student_id in cls.students:
            del cls.students[student_id]
            return f"Student ID {student_id} deleted."
        return "Student not found."

    @classmethod
    def get_student(self, student_id):
        if student_id in self.students:
            return self.students[student_id]
        return "Student not found."
    
    @classmethod
    def update_student(cls, student_id, name=None, age=None):
        if student_id in cls.students:
            return cls.students[student_id].update_student(student_id, name, age)
        return "Student not found."
    
def cli():
    print("Student Management CLI")
    
    def _get_student_ID():
        student_id = input("Enter Student ID: ")
        try:
            return int(student_id)
        except ValueError:
            print("Student ID must be an integer.")
            return None
        
    def _get_age():
        age = input("Enter Age: ")
        try:
            return int(age)
        except ValueError:
            print("Age must be an integer.")
            return None
        
    
    while True:
        print("\n--- 학생 관리 CLI ---")
        print("1. 학생 추가")
        print("2. 학생 조회")
        print("3. 학생 수정")
        print("4. 학생 삭제")
        print("5. 종료")   
        command = input("Enter command: ").strip().lower()
        if command == "1" or command == "create":
            student_id = _get_student_ID()
            if student_id in student_db.students:
                print("Student ID already exists.")
                continue
            if student_id is None:
                continue
            name = input("Enter Name: ")
            age = _get_age()
            if age is None:
                continue
            print(student_db.create_student(student_id, name, age))
        elif command == "2" or command == "read":
            student_id = _get_student_ID()
            if student_id is None:
                continue            
            print(student_db.get_student(student_id))
        elif command == "3" or command == "update":
            student_id = _get_student_ID()
            if student_id is None:
                continue            
            name = input("Enter new Name (leave blank to skip): ")
            age = _get_age()
            if age is None:
                continue
            print(student_db.update_student(student_id, name if name else None, age))
        elif command == "4" or command == "delete":
            if student_id in student_db.students:
                print("Student ID already exists.")
                continue
            if student_id is None:
                continue            
            print(student_db.delete_student(student_id))
        elif command == "5" or command == "exit":
            print("Exiting CLI.")
            break
        else:
            print("Invalid command.")
    
    
    
if __name__ == "__main__":
    # Example usage
    with open("students.json", "w") as f:
        json.dump(student_db.students, f, default=lambda o: o.__dict__)
    cli()
