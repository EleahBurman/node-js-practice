const express = require('express');
const mongoose = require('mongoose');
const Student = require('./student');
const app = express();
const port = 3000;
const databaseUrl = "mongodb://127.0.0.1:27017/HelloRestDatabase";



//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

async function main(){
    await mongoose.connect(databaseUrl)
    console.log("mongoose is connected")
}

main().catch(console.error);



const router = express.Router();
//middleware for router
router.use(function(req,res,next){
    console.log('Received request from client');
    next();
});

router.get('/', (req, res, next) => {
    res.json({ message: 'Able to visit /api'});
});

router.route('/students')
    .get(async (req,res) => {
        try{
            const students = await Student.find();
            res.json(students);
        } catch (err) {
            console.error(err);
            res.json({ message: err });
          }   
    })
    .post(async (req,res) => {
        const {name, numberOfCourses} = req.body
        try {
            let newStudent = await Student.create({name, numberOfCourses});
      
            // Use await to wait for the save operation to complete
            await newStudent.save();
      
            res.status(201).json({ student: newStudent, message: 'Student added to database' }); // Use status(201) for resource creation

          } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message }); // Use status(500) for internal server errors

          }   
    })

router.route('/students/:student_id')
    .get(async (req, res) => {
      const {name, numberOfCourses} = req.body
      try {
         // Get the student_id from the URL parameter
        const studentId = req.params.student_id;
         // Pass the student_id to findById
        const student = await Student.findById(studentId);
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    })
    .put(async (req, res) => {
      try {
        // Get the student_id from the URL parameter
        const studentId = req.params.student_id;
        // Pass the student_id to findById
        const student = await Student.findById(studentId);
        
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }

        // Enforce that both name and numberOfCourses are provided
        if (req.body.name && req.body.numberOfCourses) {
          student.name = req.body.name;
          student.numberOfCourses = req.body.numberOfCourses;
        } else {
          return res.status(400).json({ message: 'Both name and numberOfCourses are required for a PUT request' });
        }

        // Save the updated document
        const updatedStudent = await student.save();

        res.json({ student: updatedStudent, message: 'Student updated successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Student not able to update' });
      }
    })
    .patch(async (req, res) => {
      try {
        // Get the student_id from the URL parameter
        const studentId = req.params.student_id;
        // Pass the student_id to findById
        const student = await Student.findById(studentId);
        
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }

        // Update only the fields present in the request body
        if (req.body.name) {
          student.name = req.body.name;
        } else if (req.body.numberOfCourses) {
          student.numberOfCourses = req.body.numberOfCourses;
        } else {
          return res.status(400).json({ message: 'Provide a name or number of courses for a patch request' });
        }

        // Save the updated document
        const updatedStudent = await student.save();

        res.json({ student: updatedStudent, message: 'Student updated successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Student not able to update' });
      }
    })
    .delete(async (req, res) => {
      try {
        // Get the student_id from the URL parameter
        const studentId = req.params.student_id;
        
        // Pass the student_id to deleteOne and capture the result
        const deletedStudent = await Student.deleteOne({ _id: studentId });
    
        // Check if the deletion was successful
        console.log(deletedStudent , "what is on this ")
        if (!deletedStudent) {
          return res.status(404).json({ message: 'Student not found' });
        }
    
        res.json({ message: 'Student deleted successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Student not able to delete' });
      }
    });
    
    // .put(async (req, res) => {
    //   try {
    //     const studentId = req.params.student_id;
    //     console.log('Request Body:', req.body); // Add this line to log the request body

    //     // Use findOneAndUpdate to update and return the modified document
    //     const updatedStudent = await Student.findOneAndUpdate(
    //       { _id: studentId },
    //       { $set: { name: req.body.name, numberOfCourses: req.body.numberOfCourses } },
    //       { new: true } // This option ensures that the updated document is returned
    //     );
    
    //     if (!updatedStudent) {
    //       return res.status(404).json({ message: 'Student not found' });
    //     }
    
    //     res.json({ student: updatedStudent, message: 'Student updated successfully' });
    //   } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: 'Student not able to update' });
    //   }
    // })
    
    // .patch(async (req, res) => {
    //   try {
    //     const studentId = req.params.student_id;
    
    //     // Use findOneAndUpdate to update and return the modified document
    //     const updatedStudent = await Student.findOneAndUpdate(
    //       { _id: studentId },
    //       { $set: req.body }, // Assuming req.body contains the fields to be updated
    //       { new: true } // This option ensures that the updated document is returned
    //     );
    
    //     if (!updatedStudent) {
    //       return res.status(404).json({ message: 'Student not found' });
    //     }
    
    //     res.json({ student: updatedStudent, message: 'Student updated successfully' });
    //   } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: 'Student not able to update' });
    //   }
    // })

app.use('/api', router);
app.listen(port, () => {
    console.log(`Server has started on Port ${port}`)
});