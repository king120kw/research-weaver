
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [studentVisible, setStudentVisible] = useState(false);
  const [teacherVisible, setTeacherVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // Staggered animation sequence
      setTimeout(() => setTitleVisible(true), 200);
      setTimeout(() => setStudentVisible(true), 500);
      setTimeout(() => setTeacherVisible(true), 700);
    }
  }, [isLoaded]);

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
    setTimeout(() => {
      navigate('/onboarding', { state: { role: role } });
    }, 300);
  };

  return (
    <div className="min-h-screen w-full gradient-welcome relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 gradient-mesh opacity-20"></div>

      {/* Main Content Container */}
      <div className={`min-h-screen w-full relative z-10 transition-all duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

        {/* Desktop Layout - Enhanced */}
        <div className="hidden lg:flex desktop-split">
          {/* Left side - Enhanced Title and Info */}
          <div className="w-1/2 desktop-sidebar text-right">
            <div className="space-fluid-2xl animate-fade-in-up">
              <h1 className="text-fluid-display font-bold text-gray-800 mb-6 leading-tight">
                Welcome to YadaLearn
              </h1>
              <p className="text-fluid-subheading text-gray-600 mb-8 leading-relaxed">
                Choose your role to get started
              </p>
              <p className="text-fluid-body text-gray-500 leading-relaxed">
                Join thousands of learners and educators worldwide
              </p>
            </div>
          </div>

          {/* Right side - Enhanced Role Selection Cards */}
          <div className="w-1/2 desktop-main">
            <div className="space-y-12">

              {/* Student Role - Enhanced 3D */}
              <div
                className={`transition-all duration-700 ease-out ${
                  studentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
              >
                <div
                  className={`role-card-3d group cursor-pointer relative`}
                  onClick={() => handleRoleSelect('student')}
                  onMouseMove={(e) => {
                    const card = e.currentTarget;
                    const rect = card.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const rotateX = (e.clientY - centerY) / 20;
                    const rotateY = (centerX - e.clientX) / 20;

                    card.style.setProperty('--rotate-x', `${rotateX}deg`);
                    card.style.setProperty('--rotate-y', `${rotateY}deg`);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('--rotate-x', '0deg');
                    e.currentTarget.style.setProperty('--rotate-y', '0deg');
                  }}
                >
                  <div className="relative">
                    {/* Complex shadow effect for student */}
                    <div
                      className={`transition-all duration-300 ${
                        selectedRole === 'student'
                          ? 'opacity-100 scale-110'
                          : 'opacity-0 group-hover:opacity-50 group-hover:scale-105'
                      }`}
                      style={{
                        width: '300px',
                        height: '400px',
                        background: 'linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 100%)',
                        clipPath: 'polygon(0 0, 85% 0, 100% 85%, 15% 100%, 0 85%)',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        zIndex: -1,
                        boxShadow: `
                          #e9e5fd 0 0, #e9e5fd 0 1px, #e9e5fd 0 2px, #e8e4fc 0 3px,
                          #e7e3fb 0 4px, #e6e2fa 0 5px, #e5e1f9 0 6px, #e4e0f8 0 7px,
                          #e3dff7 0 8px, #e2def6 0 9px, #e1ddf5 0 10px, #e0dcf4 0 11px,
                          #dfdbf3 0 12px, #dedaf2 0 13px, #ddd9f1 0 14px, #dcd8f0 0 15px,
                          #dbd7ef 0 16px, #dad6ee 0 17px, #d9d5ed 0 18px, #d8d4ec 0 19px,
                          #d7d3eb 0 20px, #d6d2ea 0 21px, #d5d1e9 0 22px, #d4d0e8 0 23px,
                          #d3cfe7 0 24px, #d2cee6 0 25px, #d1cde5 0 26px, #d0cce4 0 27px,
                          #cfcbe3 0 28px, #cecae2 0 29px, #cdc9e1 0 30px, #ccc8e0 0 31px,
                          #cbcae0 0 32px, #cac9df 0 33px, #c9c8de 0 34px, #c8c7dd 0 35px,
                          #c7c6dc 0 36px, #c6c5db 0 37px, #c5c4da 0 38px, #c4c3d9 0 39px,
                          #c3c2d8 0 40px, #c2c1d7 0 41px, #c1c0d6 0 42px, #c0bfd5 0 43px,
                          #bfbed4 0 44px, #bebbd3 0 45px, #bdbbd2 0 46px, #bcbad1 0 47px,
                          #bbb9d0 0 48px, #bab8cf 0 49px, #b9b7ce 0 50px, #b8b6cd 0 51px,
                          #b7b5cc 0 52px, #b6b4cb 0 53px, #b5b3ca 0 54px, #b4b2c9 0 55px,
                          #b3b1c8 0 56px, #b2b0c7 0 57px, #b1afc6 0 58px, #b0aec5 0 59px,
                          #afaec4 0 60px, #aeadc3 0 61px, #adacc2 0 62px, #acabc1 0 63px,
                          #abaac0 0 64px, #aaa9bf 0 65px, #a9a8be 0 66px, #a8a7bd 0 67px,
                          #a7a6bc 0 68px, #a6a5bb 0 69px, #a5a4ba 0 70px, #a4a3b9 0 71px,
                          #a3a2b8 0 72px, #a2a1b7 0 73px, #a1a0b6 0 74px, #a09fb5 0 75px,
                          #9f9eb4 0 76px, #9e9db3 0 77px, #9d9cb2 0 78px, #9c9bb1 0 79px,
                          #9b9ab0 0 80px, #9a99af 0 81px, #9998ae 0 82px, #9897ad 0 83px,
                          #9796ac 0 84px, #9695ab 0 85px, #9594aa 0 86px, #9493a9 0 87px,
                          #9392a8 0 88px, #9291a7 0 89px, #9190a6 0 90px, #908fa5 0 91px,
                          #8f8ea4 0 92px, #8e8da3 0 93px, #8d8ca2 0 94px, #8c8ba1 0 95px,
                          #8b8aa0 0 96px, #8a899f 0 97px, #89889e 0 98px, #88879d 0 99px,
                          #87879c 0 100px, #86869b 0 101px, #85859a 0 102px, #848499 0 103px,
                          #838398 0 104px, #828297 0 105px, #818196 0 106px, #808095 0 107px,
                          #7f7f94 0 108px, #7e7e93 0 109px, #7d7d92 0 110px, #7c7c91 0 111px,
                          #7b7b90 0 112px, #7a7a8f 0 113px, #79798e 0 114px, #78788d 0 115px,
                          #77778c 0 116px, #76768b 0 117px, #75758a 0 118px, #747489 0 119px,
                          #737388 0 120px, #727287 0 121px, #717186 0 122px, #707085 0 123px,
                          #6f6f84 0 124px, #6e6e83 0 125px, #6d6d82 0 126px, #6c6c81 0 127px,
                          #6b6b80 0 128px, #6a6a7f 0 129px, #69697e 0 130px, #68687d 0 131px,
                          #67677c 0 132px, #66667b 0 133px, #65657a 0 134px, #646479 0 135px,
                          #636378 0 136px, #626277 0 137px, #616176 0 138px, #606075 0 139px,
                          #5f5f74 0 140px, #5e5e73 0 141px, #5d5d72 0 142px, #5c5c71 0 143px,
                          #5b5b70 0 144px, #5a5a6f 0 145px, #59596e 0 146px, #58586d 0 147px,
                          #57576c 0 148px, #56566b 0 149px, #55556a 0 150px, #545469 0 151px,
                          #535368 0 152px, #525267 0 153px, #515166 0 154px, #505065 0 155px,
                          #4f4f64 0 156px, #4e4e63 0 157px, #4d4d62 0 158px, #4c4c61 0 159px,
                          #4b4b60 0 160px, #4a4a5f 0 161px, #49495e 0 162px, #48485d 0 163px,
                          #47475c 0 164px, #46465b 0 165px, #45455a 0 166px, #444459 0 167px,
                          #434358 0 168px, #424257 0 169px, #414156 0 170px, #404055 0 171px,
                          #3f3f54 0 172px, #3e3e53 0 173px, #3d3d52 0 174px, #3c3c51 0 175px,
                          #3b3b50 0 176px, #3a3a4f 0 177px, #39394e 0 178px, #38384d 0 179px,
                          #37374c 0 180px, #36364b 0 181px, #35354a 0 182px, #343449 0 183px,
                          #333348 0 184px, #323247 0 185px, #313146 0 186px, #303045 0 187px,
                          #2f2f44 0 188px, #2e2e43 0 189px, #2d2d42 0 190px, #2c2c41 0 191px,
                          #2b2b40 0 192px, #2a2a3f 0 193px, #29293e 0 194px, #28283d 0 195px,
                          #27273c 0 196px, #26263b 0 197px, #25253a 0 198px, #242439 0 199px
                        `
                      }}
                    />

                    {/* Student Card Content */}
                    <div className="relative bg-white rounded-3xl p-8 shadow-lg">
                      {/* Student Avatar */}
                      <div className="relative mx-auto mb-6 h-32 w-32">
                        <div className="h-full w-full rounded-full border-4 border-white bg-gradient-to-br from-purple-200 to-purple-300 shadow-lg">
                        <img
                          src="/images/download (9).png"
                          alt="Student"
                          className="h-full w-full rounded-full object-cover"
                        />
                        </div>
                      </div>

                      {/* Student Label */}
                      <h2 className="text-3xl font-bold text-gray-900 mb-3">Student</h2>
                      <p className="text-gray-600 text-lg">Find teachers and start your learning journey</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Role - Enhanced 3D */}
              <div
                className={`transition-all duration-700 ease-out delay-200 ${
                  teacherVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
              >
                <div
                  className={`role-card-3d group cursor-pointer relative`}
                  onClick={() => handleRoleSelect('teacher')}
                  onMouseMove={(e) => {
                    const card = e.currentTarget;
                    const rect = card.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const rotateX = (e.clientY - centerY) / 20;
                    const rotateY = (centerX - e.clientX) / 20;

                    card.style.setProperty('--rotate-x', `${rotateX}deg`);
                    card.style.setProperty('--rotate-y', `${rotateY}deg`);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty('--rotate-x', '0deg');
                    e.currentTarget.style.setProperty('--rotate-y', '0deg');
                  }}
                >
                  <div className="relative">
                    {/* Complex shadow effect for teacher */}
                    <div
                      className={`transition-all duration-300 ${
                        selectedRole === 'teacher'
                          ? 'opacity-100 scale-110'
                          : 'opacity-0 group-hover:opacity-50 group-hover:scale-105'
                      }`}
                      style={{
                        width: '300px',
                        height: '400px',
                        background: 'linear-gradient(135deg, #A7F3D0 0%, #6EE7B7 100%)',
                        clipPath: 'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 85%, 0 15%)',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        zIndex: -1,
                        boxShadow: `
                          #e0f8ed 0 0, #e0f8ed 0 1px, #e0f8ed 0 2px, #dff7ec 0 3px,
                          #def6eb 0 4px, #ddf5ea 0 5px, #dcf4e9 0 6px, #dbf3e8 0 7px,
                          #daf2e7 0 8px, #d9f1e6 0 9px, #d8f0e5 0 10px, #d7efe4 0 11px,
                          #d6eee3 0 12px, #d5ede2 0 13px, #d4ece1 0 14px, #d3ebe0 0 15px,
                          #d2eae0 0 16px, #d1e9df 0 17px, #d0e8de 0 18px, #cfe7dd 0 19px,
                          #cee6dc 0 20px, #cde5db 0 21px, #cce4da 0 22px, #cbe3d9 0 23px,
                          #cae2d8 0 24px, #c9e1d7 0 25px, #c8e0d6 0 26px, #c7dfd5 0 27px,
                          #c6ded4 0 28px, #c5ddd3 0 29px, #c4dcd2 0 30px, #c3dbd1 0 31px,
                          #c2dad0 0 32px, #c1d9cf 0 33px, #c0d8ce 0 34px, #bfd7cd 0 35px,
                          #bed6cc 0 36px, #bdd5cb 0 37px, #bcd4ca 0 38px, #bbd3c9 0 39px,
                          #bad2c8 0 40px, #b9d1c7 0 41px, #b8d0c6 0 42px, #b7cfc5 0 43px,
                          #b6cec4 0 44px, #b5cdc3 0 45px, #b4ccc2 0 46px, #b3cbc1 0 47px,
                          #b2cac0 0 48px, #b1c9bf 0 49px, #b0c8be 0 50px, #afc7bd 0 51px,
                          #aec6bc 0 52px, #adc5bb 0 53px, #acc4ba 0 54px, #abc3b9 0 55px,
                          #aac2b8 0 56px, #a9c1b7 0 57px, #a8c0b6 0 58px, #a7bfb5 0 59px,
                          #a6beb4 0 60px, #a5bdb3 0 61px, #a4bcb2 0 62px, #a3bbb1 0 63px,
                          #a2bab0 0 64px, #a1b9af 0 65px, #a0b8ae 0 66px, #9fb7ad 0 67px,
                          #9eb6ac 0 68px, #9db5ab 0 69px, #9cb4aa 0 70px, #9bb3a9 0 71px,
                          #9ab2a8 0 72px, #99b1a7 0 73px, #98b0a6 0 74px, #97afa5 0 75px,
                          #96aea4 0 76px, #95ada3 0 77px, #94aca2 0 78px, #93aba1 0 79px,
                          #92aaa0 0 80px, #91a99f 0 81px, #90a89e 0 82px, #8fa79d 0 83px,
                          #8ea69c 0 84px, #8da59b 0 85px, #8ca49a 0 86px, #8ba399 0 87px,
                          #8aa298 0 88px, #89a197 0 89px, #88a096 0 90px, #879f95 0 91px,
                          #869e94 0 92px, #859d93 0 93px, #849c92 0 94px, #839b91 0 95px,
                          #829a90 0 96px, #81998f 0 97px, #80988e 0 98px, #7f978d 0 99px,
                          #7e968c 0 100px, #7d958b 0 101px, #7c948a 0 102px, #7b9389 0 103px,
                          #7a9288 0 104px, #799187 0 105px, #789086 0 106px, #778f85 0 107px,
                          #768e84 0 108px, #758d83 0 109px, #748c82 0 110px, #738b81 0 111px,
                          #728a80 0 112px, #71897f 0 113px, #70887e 0 114px, #6f877d 0 115px,
                          #6e867c 0 116px, #6d857b 0 117px, #6c847a 0 118px, #6b8379 0 119px,
                          #6a8278 0 120px, #698177 0 121px, #688076 0 122px, #677f75 0 123px,
                          #667e74 0 124px, #657d73 0 125px, #647c72 0 126px, #637b71 0 127px,
                          #627a70 0 128px, #61796f 0 129px, #60786e 0 130px, #5f776d 0 131px,
                          #5e766c 0 132px, #5d756b 0 133px, #5c746a 0 134px, #5b7369 0 135px,
                          #5a7268 0 136px, #597167 0 137px, #587066 0 138px, #576f65 0 139px,
                          #566e64 0 140px, #556d63 0 141px, #546c62 0 142px, #536b61 0 143px,
                          #526a60 0 144px, #51695f 0 145px, #50685e 0 146px, #4f675d 0 147px,
                          #4e665c 0 148px, #4d655b 0 149px, #4c645a 0 150px, #4b6359 0 151px,
                          #4a6258 0 152px, #496157 0 153px, #486056 0 154px, #475f55 0 155px,
                          #465e54 0 156px, #455d53 0 157px, #445c52 0 158px, #435b51 0 159px,
                          #425a50 0 160px, #41594f 0 161px, #40584e 0 162px, #3f574d 0 163px,
                          #3e564c 0 164px, #3d554b 0 165px, #3c544a 0 166px, #3b5349 0 167px,
                          #3a5248 0 168px, #395147 0 169px, #385046 0 170px, #374f45 0 171px,
                          #364e44 0 172px, #354d43 0 173px, #344c42 0 174px, #334b41 0 175px,
                          #324a40 0 176px, #31493f 0 177px, #30483e 0 178px, #2f473d 0 179px,
                          #2e463c 0 180px, #2d453b 0 181px, #2c443a 0 182px, #2b4339 0 183px,
                          #2a4238 0 184px, #294137 0 185px, #284036 0 186px, #273f35 0 187px,
                          #263e34 0 188px, #253d33 0 189px, #243c32 0 190px, #233b31 0 191px,
                          #223a30 0 192px, #21392f 0 193px, #20382e 0 194px, #1f372d 0 195px,
                          #1e362c 0 196px, #1d352b 0 197px, #1c342a 0 198px, #1b3329 0 199px
                        `
                      }}
                    />

                    {/* Teacher Card Content */}
                    <div className="relative bg-white rounded-3xl p-8 shadow-lg">
                      {/* Teacher Avatar */}
                      <div className="relative mx-auto mb-6 h-32 w-32">
                        <div className="h-full w-full rounded-full border-4 border-white bg-gradient-to-br from-blue-200 to-teal-300 shadow-lg">
                          <img
                            src="/teacher-role.png"
                            alt="Teacher"
                            className="h-full w-full rounded-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Teacher Label */}
                      <h2 className="text-3xl font-bold text-gray-900 mb-3">Teacher</h2>
                      <p className="text-gray-600 text-lg">Share your knowledge and inspire students</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden h-full flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-sm text-center space-y-8">

            {/* Header - Mobile */}
            <div className="space-y-4">
              <h1
                className={`text-4xl font-bold text-gray-800 transition-all duration-700 ease-out ${
                  titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Welcome to YadaLearn
              </h1>
              <p
                className={`text-lg text-gray-600 transition-all duration-700 ease-out delay-200 ${
                  titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                Choose your role to get started
              </p>
            </div>

            {/* Student Role - Mobile */}
            <div
              className={`transition-all duration-700 ease-out ${
                studentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div
                className={`group cursor-pointer transition-all duration-300 ${
                  selectedRole === 'student' ? 'scale-105' : 'hover:scale-105'
                }`}
                onClick={() => handleRoleSelect('student')}
              >
                <div className="relative">
                  {/* Mobile shadow effect for student */}
                  <div
                    className={`transition-all duration-300 ${
                      selectedRole === 'student'
                        ? 'opacity-100 scale-110'
                        : 'opacity-0 group-hover:opacity-50 group-hover:scale-105'
                    }`}
                    style={{
                      width: '280px',
                      height: '360px',
                      background: 'linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 100%)',
                      clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)',
                      position: 'absolute',
                      top: '0',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: -1,
                      boxShadow: `
                        #e9e5fd 0 0, #e9e5fd 0 1px, #e9e5fd 0 2px, #e8e4fc 0 3px,
                        #e7e3fb 0 4px, #e6e2fa 0 5px, #e5e1f9 0 6px, #e4e0f8 0 7px,
                        #e3dff7 0 8px, #e2def6 0 9px, #e1ddf5 0 10px, #e0dcf4 0 11px,
                        #dfdbf3 0 12px, #dedaf2 0 13px, #ddd9f1 0 14px, #dcd8f0 0 15px,
                        #dbd7ef 0 16px, #dad6ee 0 17px, #d9d5ed 0 18px, #d8d4ec 0 19px,
                        #d7d3eb 0 20px, #d6d2ea 0 21px, #d5d1e9 0 22px, #d4d0e8 0 23px,
                        #d3cfe7 0 24px, #d2cee6 0 25px, #d1cde5 0 26px, #d0cce4 0 27px,
                        #cfcbe3 0 28px, #cecae2 0 29px, #cdc9e1 0 30px, #ccc8e0 0 31px,
                        #cbcae0 0 32px, #cac9df 0 33px, #c9c8de 0 34px, #c8c7dd 0 35px,
                        #c7c6dc 0 36px, #c6c5db 0 37px, #c5c4da 0 38px, #c4c3d9 0 39px,
                        #c3c2d8 0 40px, #c2c1d7 0 41px, #c1c0d6 0 42px, #c0bfd5 0 43px,
                        #bfbed4 0 44px, #bebbd3 0 45px, #bdbbd2 0 46px, #bcbad1 0 47px,
                        #bbb9d0 0 48px, #bab8cf 0 49px, #b9b7ce 0 50px, #b8b6cd 0 51px,
                        #b7b5cc 0 52px, #b6b4cb 0 53px, #b5b3ca 0 54px, #b4b2c9 0 55px,
                        #b3b1c8 0 56px, #b2b0c7 0 57px, #b1afc6 0 58px, #b0aec5 0 59px,
                        #afaec4 0 60px, #aeadc3 0 61px, #adacc2 0 62px, #acabc1 0 63px,
                        #abaac0 0 64px, #aaa9bf 0 65px, #a9a8be 0 66px, #a8a7bd 0 67px,
                        #a7a6bc 0 68px, #a6a5bb 0 69px, #a5a4ba 0 70px, #a4a3b9 0 71px,
                        #a3a2b8 0 72px, #a2a1b7 0 73px, #a1a0b6 0 74px, #a09fb5 0 75px,
                        #9f9eb4 0 76px, #9e9db3 0 77px, #9d9cb2 0 78px, #9c9bb1 0 79px,
                        #9b9ab0 0 80px, #9a99af 0 81px, #9998ae 0 82px, #9897ad 0 83px,
                        #9796ac 0 84px, #9695ab 0 85px, #9594aa 0 86px, #9493a9 0 87px,
                        #9392a8 0 88px, #9291a7 0 89px, #9190a6 0 90px, #908fa5 0 91px,
                        #8f8ea4 0 92px, #8e8da3 0 93px, #8d8ca2 0 94px, #8c8ba1 0 95px,
                        #8b8aa0 0 96px, #8a899f 0 97px, #89889e 0 98px, #88879d 0 99px,
                        #87879c 0 100px, #86869b 0 101px, #85859a 0 102px, #848499 0 103px,
                        #838398 0 104px, #828297 0 105px, #818196 0 106px, #808095 0 107px,
                        #7f7f94 0 108px, #7e7e93 0 109px, #7d7d92 0 110px, #7c7c91 0 111px,
                        #7b7b90 0 112px, #7a7a8f 0 113px, #79798e 0 114px, #78788d 0 115px,
                        #77778c 0 116px, #76768b 0 117px, #75758a 0 118px, #747489 0 119px,
                        #737388 0 120px, #727287 0 121px, #717186 0 122px, #707085 0 123px,
                        #6f6f84 0 124px, #6e6e83 0 125px, #6d6d82 0 126px, #6c6c81 0 127px,
                        #6b6b80 0 128px, #6a6a7f 0 129px, #69697e 0 130px, #68687d 0 131px,
                        #67677c 0 132px, #66667b 0 133px, #65657a 0 134px, #646479 0 135px,
                        #636378 0 136px, #626277 0 137px, #616176 0 138px, #606075 0 139px,
                        #5f5f74 0 140px, #5e5e73 0 141px, #5d5d72 0 142px, #5c5c71 0 143px,
                        #5b5b70 0 144px, #5a5a6f 0 145px, #59596e 0 146px, #58586d 0 147px,
                        #57576c 0 148px, #56566b 0 149px, #55556a 0 150px, #545469 0 151px,
                        #535368 0 152px, #525267 0 153px, #515166 0 154px, #505065 0 155px,
                        #4f4f64 0 156px, #4e4e63 0 157px, #4d4d62 0 158px, #4c4c61 0 159px,
                        #4b4b60 0 160px, #4a4a5f 0 161px, #49495e 0 162px, #48485d 0 163px,
                        #47475c 0 164px, #46465b 0 165px, #45455a 0 166px, #444459 0 167px,
                        #434358 0 168px, #424257 0 169px, #414156 0 170px, #404055 0 171px,
                        #3f3f54 0 172px, #3e3e53 0 173px, #3d3d52 0 174px, #3c3c51 0 175px,
                        #3b3b50 0 176px, #3a3a4f 0 177px, #39394e 0 178px, #38384d 0 179px,
                        #37374c 0 180px, #36364b 0 181px, #35354a 0 182px, #343449 0 183px,
                        #333348 0 184px, #323247 0 185px, #313146 0 186px, #303045 0 187px,
                        #2f2f44 0 188px, #2e2e43 0 189px, #2d2d42 0 190px, #2c2c41 0 191px,
                        #2b2b40 0 192px, #2a2a3f 0 193px, #29293e 0 194px, #28283d 0 195px,
                        #27273c 0 196px, #26263b 0 197px, #25253a 0 198px, #242439 0 199px
                      `
                    }}
                  />

                  {/* Student Card Content - Mobile */}
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg mx-auto" style={{ width: '280px' }}>
                    {/* Student Avatar */}
                    <div className="relative mx-auto mb-4 h-24 w-24">
                      <div className="h-full w-full rounded-full border-4 border-white bg-gradient-to-br from-purple-200 to-purple-300 shadow-lg">
                        <img
                          src="/images/download (9).png"
                          alt="Student"
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Student Label */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Student</h2>
                    <p className="text-gray-600">Find teachers and start your learning journey</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Role - Mobile */}
            <div
              className={`transition-all duration-700 ease-out delay-200 ${
                teacherVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div
                className={`group cursor-pointer transition-all duration-300 ${
                  selectedRole === 'teacher' ? 'scale-105' : 'hover:scale-105'
                }`}
                onClick={() => handleRoleSelect('teacher')}
              >
                <div className="relative">
                  {/* Mobile shadow effect for teacher */}
                  <div
                    className={`transition-all duration-300 ${
                      selectedRole === 'teacher'
                        ? 'opacity-100 scale-110'
                        : 'opacity-0 group-hover:opacity-50 group-hover:scale-105'
                    }`}
                    style={{
                      width: '280px',
                      height: '360px',
                      background: 'linear-gradient(135deg, #A7F3D0 0%, #6EE7B7 100%)',
                      clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 100%)',
                      position: 'absolute',
                      top: '0',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: -1,
                      boxShadow: `
                        #e0f8ed 0 0, #e0f8ed 0 1px, #e0f8ed 0 2px, #dff7ec 0 3px,
                        #def6eb 0 4px, #ddf5ea 0 5px, #dcf4e9 0 6px, #dbf3e8 0 7px,
                        #daf2e7 0 8px, #d9f1e6 0 9px, #d8f0e5 0 10px, #d7efe4 0 11px,
                        #d6eee3 0 12px, #d5ede2 0 13px, #d4ece1 0 14px, #d3ebe0 0 15px,
                        #d2eae0 0 16px, #d1e9df 0 17px, #d0e8de 0 18px, #cfe7dd 0 19px,
                        #cee6dc 0 20px, #cde5db 0 21px, #cce4da 0 22px, #cbe3d9 0 23px,
                        #cae2d8 0 24px, #c9e1d7 0 25px, #c8e0d6 0 26px, #c7dfd5 0 27px,
                        #c6ded4 0 28px, #c5ddd3 0 29px, #c4dcd2 0 30px, #c3dbd1 0 31px,
                        #c2dad0 0 32px, #c1d9cf 0 33px, #c0d8ce 0 34px, #bfd7cd 0 35px,
                        #bed6cc 0 36px, #bdd5cb 0 37px, #bcd4ca 0 38px, #bbd3c9 0 39px,
                        #bad2c8 0 40px, #b9d1c7 0 41px, #b8d0c6 0 42px, #b7cfc5 0 43px,
                        #b6cec4 0 44px, #b5cdc3 0 45px, #b4ccc2 0 46px, #b3cbc1 0 47px,
                        #b2cac0 0 48px, #b1c9bf 0 49px, #b0c8be 0 50px, #afc7bd 0 51px,
                        #aec6bc 0 52px, #adc5bb 0 53px, #acc4ba 0 54px, #abc3b9 0 55px,
                        #aac2b8 0 56px, #a9c1b7 0 57px, #a8c0b6 0 58px, #a7bfb5 0 59px,
                        #a6beb4 0 60px, #a5bdb3 0 61px, #a4bcb2 0 62px, #a3bbb1 0 63px,
                        #a2bab0 0 64px, #a1b9af 0 65px, #a0b8ae 0 66px, #9fb7ad 0 67px,
                        #9eb6ac 0 68px, #9db5ab 0 69px, #9cb4aa 0 70px, #9bb3a9 0 71px,
                        #9ab2a8 0 72px, #99b1a7 0 73px, #98b0a6 0 74px, #97afa5 0 75px,
                        #96aea4 0 76px, #95ada3 0 77px, #94aca2 0 78px, #93aba1 0 79px,
                        #92aaa0 0 80px, #91a99f 0 81px, #90a89e 0 82px, #8fa79d 0 83px,
                        #8ea69c 0 84px, #8da59b 0 85px, #8ca49a 0 86px, #8ba399 0 87px,
                        #8aa298 0 88px, #89a197 0 89px, #88a096 0 90px, #879f95 0 91px,
                        #869e94 0 92px, #859d93 0 93px, #849c92 0 94px, #839b91 0 95px,
                        #829a90 0 96px, #81998f 0 97px, #80988e 0 98px, #7f978d 0 99px,
                        #7e968c 0 100px, #7d958b 0 101px, #7c948a 0 102px, #7b9389 0 103px,
                        #7a9288 0 104px, #799187 0 105px, #789086 0 106px, #778f85 0 107px,
                        #768e84 0 108px, #758d83 0 109px, #748c82 0 110px, #738b81 0 111px,
                        #728a80 0 112px, #71897f 0 113px, #70887e 0 114px, #6f877d 0 115px,
                        #6e867c 0 116px, #6d857b 0 117px, #6c847a 0 118px, #6b8379 0 119px,
                        #6a8278 0 120px, #698177 0 121px, #688076 0 122px, #677f75 0 123px,
                        #667e74 0 124px, #657d73 0 125px, #647c72 0 126px, #637b71 0 127px,
                        #627a70 0 128px, #61796f 0 129px, #60786e 0 130px, #5f776d 0 131px,
                        #5e766c 0 132px, #5d756b 0 133px, #5c746a 0 134px, #5b7369 0 135px,
                        #5a7268 0 136px, #597167 0 137px, #587066 0 138px, #576f65 0 139px,
                        #566e64 0 140px, #556d63 0 141px, #546c62 0 142px, #536b61 0 143px,
                        #526a60 0 144px, #51695f 0 145px, #50685e 0 146px, #4f675d 0 147px,
                        #4e665c 0 148px, #4d655b 0 149px, #4c645a 0 150px, #4b6359 0 151px,
                        #4a6258 0 152px, #496157 0 153px, #486056 0 154px, #475f55 0 155px,
                        #465e54 0 156px, #455d53 0 157px, #445c52 0 158px, #435b51 0 159px,
                        #425a50 0 160px, #41594f 0 161px, #40584e 0 162px, #3f574d 0 163px,
                        #3e564c 0 164px, #3d554b 0 165px, #3c544a 0 166px, #3b5349 0 167px,
                        #3a5248 0 168px, #395147 0 169px, #385046 0 170px, #374f45 0 171px,
                        #364e44 0 172px, #354d43 0 173px, #344c42 0 174px, #334b41 0 175px,
                        #324a40 0 176px, #31493f 0 177px, #30483e 0 178px, #2f473d 0 179px,
                        #2e463c 0 180px, #2d453b 0 181px, #2c443a 0 182px, #2b4339 0 183px,
                        #2a4238 0 184px, #294137 0 185px, #284036 0 186px, #273f35 0 187px,
                        #263e34 0 188px, #253d33 0 189px, #243c32 0 190px, #233b31 0 191px,
                        #223a30 0 192px, #21392f 0 193px, #20382e 0 194px, #1f372d 0 195px,
                        #1e362c 0 196px, #1d352b 0 197px, #1c342a 0 198px, #1b3329 0 199px
                      `
                    }}
                  />

                  {/* Teacher Card Content - Mobile */}
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg mx-auto" style={{ width: '280px' }}>
                    {/* Teacher Avatar */}
                    <div className="relative mx-auto mb-4 h-24 w-24">
                      <div className="h-full w-full rounded-full border-4 border-white bg-gradient-to-br from-blue-200 to-teal-300 shadow-lg">
                          <img
                            src="/teacher-role.png"
                            alt="Teacher"
                            className="h-full w-full rounded-full object-cover"
                          />
                      </div>
                    </div>

                    {/* Teacher Label */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher</h2>
                    <p className="text-gray-600">Share your knowledge and inspire students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
