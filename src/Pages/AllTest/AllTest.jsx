
import { Helmet } from "react-helmet-async";
// import UseAxiosPublic from "../../Hooks/UseAxiosPublic";
// import { useQuery } from "@tanstack/react-query";
import { FaEye, FaTrash } from "react-icons/fa";
import { Link, useLoaderData} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import './AllTest.css'
import Swal from "sweetalert2";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { AuthContext } from "../Provider/AuthProvider";
import UseAdmin from "../../Hooks/UseAdmin";

const AllTest = () => {
  const {user } = useContext(AuthContext)
  // const {isAdmin} = UseAdmin()
  const [totalTest, setTotalTest] = useState([])
  const axiosSecure = UseAxiosSecure()
  const [currentPage, setCurrentPage] = useState(0)
  const [testPerPage, setTestPerPage] = useState(10)

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const {count} = useLoaderData()
  const numberOfPage = Math.ceil(count / testPerPage)

  const pages = [...Array(numberOfPage).keys()]

  
  useEffect(() => {
    setLoading(true)
    fetch(`https://diagnostic-center-management-server.vercel.app/test?page=${currentPage}&size=${testPerPage}&search=${searchQuery}`)
    .then(res => res.json())
    .then(data => {
      setTotalTest(data)
      setLoading(false)
    })
  },[currentPage, testPerPage, searchQuery])

  const handleSearch = (e) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);
    console.log('Search Query:', newSearchQuery);
    setCurrentPage(0);
  };

  // const { data: tests = [] } = useQuery({
  //   queryKey: ["tests"],
  //   queryFn: async () => {
  //     const res = await axiosPublic.get(`/test?page=${currentPage}&size=${testPerPage}`);
  //     return res.data;
  //   },
  // });

  const handleTestPerPage = e =>{
    const value = parseInt(e.target.value)
    console.log(value)
    setTestPerPage(value)
    setCurrentPage(0)
  }

  const handlePrevPage = () => {
    if(currentPage > 0){
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if(currentPage < pages.length - 1){
      setCurrentPage(currentPage + 1)
    }
  }

  const handleDelete = id =>{
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            axiosSecure.delete(`/test/${id}`)
            .then(res => {
                if(res.data.deletedCount > 0){
                    Swal.fire({
                        title: "Deleted!",
                        text: "Test item has been deleted.",
                        icon: "success"
                      });
                      refetch()
                }
            })
        
        }
      });
}
  return (
    <div>
      <Helmet>
        <title>TECHMED | TEST</title>
      </Helmet>
      <div className="">
        <h2 className="uppercase text-5xl font-bold text-center mt-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">All test</h2>
        <div className="divider max-w-7xl mx-auto"></div>
      </div>
      {/* for search */}
      <div className="search-container flex justify-center">
        <input
          className="input input-bordered input-accent md:w-1/2"
          placeholder="Search by name or category(this section is case insensitive)"
          type="text"
          id="search"
          name="search"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="p-20">
        <div className="overflow-x-auto">
          <table className="table table-md">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Diagnostic Center</th>
                <th>Price</th>
                <th>Details</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
               
                {
                  totalTest.map((test) => 
                  <tr key={test._id} test={test}>
                  <td>{test.name}</td>
                  <td>{test.category}</td>
                  <td>{test.center}</td>
                  <td>{test.price}</td>
                  <td>
                    <Link to={`/testdetails/${test._id}`}>
                      <button><FaEye></FaEye></button>
                    </Link>
                  </td>
                  {/* <td className="text-red-700">
                    {user.role === 'admin'? <button onClick={() => handleDelete(test._id)}>
                      <FaTrash></FaTrash>
                    </button> : 'Only for admin'}
                  </td> */}
                  </tr>
                  )
                }
            </tbody>
          </table>
        </div>
        
      </div>
      <div className="pagination flex justify-center items-center mt-20">
                <button onClick={handlePrevPage}>Prev</button>
                {
                  pages.map(page => <button 
                    onClick={()=> setCurrentPage(page)} 
                    key={page} 
                    className={currentPage === page ? 'selected' : undefined}>{page}</button>)
                }
                <button onClick={handleNextPage}>Next</button>
                <select className="text-black" onChange={handleTestPerPage} value={testPerPage} name="" id="">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                </select>
        </div>
    </div>
  );
};

export default AllTest;
