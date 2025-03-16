

export const Select = ({name,options,title,value,onChange,width,ky,valueToSelect,bg,border}) => {
  
  return (<select className={`border ${border ? border : 'border-gray-700'} p-2 rounded-sm ${bg ? bg : 'bg-white-800'} ${width?`w-[${width}]`:'50%'}`}
    name={name}            
    onChange={onChange}
                value={value}>
                <option className="text-black-500 font-semibold bg-gray-20">{title}</option>
                {
                    options ?
                        options.map((option ,index) =>{
                            return <option key={index} value={valueToSelect ? option[valueToSelect] : option} className='text-lg'>
                              {
                                ky ? option[ky] : option.label || option
                              }
                            </option>
                        })
                    :null 
                }
    </select>
  );
};
